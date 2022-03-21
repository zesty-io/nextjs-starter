const { readFile, writeFile, stat, mkdir } = require('fs/promises');
const { resolve, normalize } = require('path');
const { exit } = require('process');
const fetch = require('node-fetch');
const chalk = require('chalk');
const Listr = require('listr');
const input = require('listr-input');
const execa = require('execa');
const SDK = require('@zesty-io/sdk');

(async () => {
  /**
   * We want the nicer input from zesty init so we coordinate
   * the cli command and the sync.js script in npm postinstall command
   * within package.json
   */
  let zestyConfig = await readZestyConfig();
  if (!zestyConfig) {
    console.log(`${chalk.red('Error:')} missing .zesty/config.json `);
    console.log(`Run the command: ${chalk.bold('zesty init')}`);
    exit();
  }

  const tasks = new Listr([
    {
      title: 'Load next.config.js',
      task: async (ctx) => {
        try {
          ctx.nextConfig = await loadNextConfig();
        } catch (error) {
          throw error;
        }
      },
    },
    {
      title: 'Set source directory',
      skip: (ctx) => {
        if (ctx.nextConfig) {
          return 'source directory in next.config.js';
        }
      },
      task: (ctx) =>
        input(
          `Enter path to source directory. ${chalk.italic(
            'Leave empty if current directory.',
          )}`,
          {
            done: (src_dir) => {
              ctx.src_dir = src_dir
                ? // ensure directory contains trailing slash
                  src_dir.slice(-1) === '/'
                  ? src_dir
                  : `${src_dir}/`
                : '';
            },
          },
        ),
    },
    {
      title: 'Fetching instance settings',
      skip: (ctx) => {
        if (ctx.nextConfig?.env?.zesty?.stage_password) {
          return 'instance settings in next.config.js';
        }
      },
      task: async (ctx) => {
        try {
          const { stdout } = await execa('zesty', ['auth:get-user-token']);
          if (!stdout) {
            throw new Error(
              `Login using the command: ${chalk.bold('zesty auth:login')}`,
            );
          }

          const instance = Object.values(zestyConfig)[0];

          ctx.sdk = new SDK(instance.ZUID, stdout);
          const verify = await ctx.sdk.auth.verifyToken(stdout);
          if (verify.statusCode !== 200) {
            throw new Error(
              `Login using the command: ${chalk.bold('zesty auth:login')}`,
            );
          }

          const settings = await fetch(
            `https://${instance.ZUID}.api.zesty.io/v1/env/settings`,
            {
              headers: {
                Authorization: `Bearer ${stdout}`,
              },
            },
          ).then((res) => res.json());

          if (settings && Array.isArray(settings.data)) {
            const lock = settings.data.find(
              (setting) => setting.key === 'preview_lock_password',
            );

            if (lock) {
              ctx.stage_password = lock.value;
            }

            // TODO check if hybrid or headless is active. if not, turn on hybrid
            // TODO check gql is activated.
            // TODO check gql cors is set?
          }
        } catch (error) {
          throw error;
        }
      },
    },
    {
      title: 'Generate next.config.js',
      skip: (ctx) => {
        if (
          ctx.nextConfig?.env?.zesty?.instance_zuid &&
          ctx.nextConfig?.env?.zesty?.stage
        ) {
          return 'instance zuid and stage url are in next.config.js';
        }
      },
      task: async (ctx) => {
        try {
          const instance = Object.values(zestyConfig)[0];

          await writeNextConfig({
            ...instance,
            src_dir: ctx.src_dir || '',
            stage_password: ctx.stage_password || '',
          });

          ctx.nextConfig = await loadNextConfig();
        } catch (error) {
          throw error;
        }
      },
    },
    {
      title: 'Generate components',
      task: async (ctx) => {
        try {
          const steps = await createFiles(ctx.nextConfig.env.zesty);
          return new Listr(
            steps.map((step, index) => {
              return {
                title: `Step ${index}`,
                skip: async () => {
                  return await step;
                },
                task: async () => {
                  return await step;
                },
              };
            }),
          );
        } catch (error) {
          throw error;
        }
      },
    },
    {
      title: 'TODO: Updating .gitignore',
      task: async () => {
        try {
          // TODO remove from .gitignore so they are persisted to a users repo
          /**
         * ### 
# These are added during the post install and then the gitignore rules removed
.zesty
next.config.js
views/zesty
###
         */
        } catch (error) {
          throw error;
        }
      },
    },
    {
      title: 'Cleanup',
      task: () => {
        // TODO cleanup and reset .gitignore to drop .zesty directory and next.config.js
      },
    },
  ]);

  tasks.run().catch((err) => {
    console.error(err);
  });
})();

async function readZestyConfig() {
  try {
    const file = resolve(process.cwd(), '.zesty/config.json');
    const str = await readFile(file, {
      encoding: 'utf-8',
    });

    return JSON.parse(str);
  } catch (error) {
    return null;
  }
}

async function writeNextConfig(config = {}) {
  const file = resolve(process.cwd(), 'next.config.js');
  try {
    await writeFile(
      file,
      `
// generated by lib/sync.js
module.exports = {
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  env: {
      zesty: {
          instance_zuid: "${config.ZUID}", // zesty unique id of content instance
          stage: "https://${config.randomHashID}-dev.webengine.zesty.io", // e.g. https://XYZ-dev.webengine.zesty.io
          production: "http://${config.domain}", // e.g. https://www.acme.com
          stage_password: "${config.stage_password}",
          src_dir: "${config.src_dir}" // where the next project has pages, components, etc folders
      }
  }
}`,
    );
  } catch (error) {
    throw error;
  }
}

async function loadNextConfig() {
  try {
    const file = resolve(process.cwd(), 'next.config.js');
    const config = require(file);
    return config;
  } catch (error) {
    return null;
  }
}

/**
 * fetch ${preview}/-/gql/ and generate view components and index.js
 * @param {*} config
 * @returns
 */
async function createFiles(config) {
  // Create directory
  const zestyModelsDir = resolve(
    process.cwd(),
    normalize(`${config.src_dir}views/zesty`),
  );

  try {
    await stat(zestyModelsDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await mkdir(zestyModelsDir, { recursive: true });
    } else {
      throw error;
    }
  }

  // FIXME: currently new instances do not have a proper preview lock setting and
  // it prevents the gql endpoint being accessible

  // Fetch instance data
  const gql = `${config.stage}/-/gql/?zpw=${config.stage_password}`;
  const gqlJSON = await fetch(gql).then((res) => res.json());

  // Generate view files
  const steps = [];
  for (const model of gqlJSON.models) {
    const filePath = `${zestyModelsDir}/${model.gqlModelName}.js`;

    try {
      await stat(filePath);
      steps.push(
        Promise.resolve(`Skipped: ${model.label} already exists ${filePath}`),
      );
    } catch (error) {
      if (error.code === 'ENOENT') {
        const step = createComponent(
          filePath,
          model,
          config.instance_zuid,
        ).then(() => `Created: ${model.label} to ${filePath}`);
        steps.push(step);
      } else {
        throw error;
      }
    }
  }

  // Generate index export
  const index = createComponentIndex(zestyModelsDir, gqlJSON.models).then(
    () => `Created index.js`,
  );
  steps.push(index);

  return steps;
}

async function createComponent(path, model, instanceZUID = '') {
  const dt = new Date().toString();
  const fields = Object.keys(model.fields)
    .map((field) => ` * ${field} (${model.fields[field]})`)
    .join('\n');

  const content = `/**
 * Zesty.io Content Model Component
 * When the ZestyLoader [..slug].js file is used, this component will autoload if it associated with the URL
 *
 * Label: ${model.label}
 * Name: ${model.name}
 * Model ZUID: ${model.zuid}
 * File Created On: ${dt}
 *
 * Model Fields:
 *
 ${fields}
 *
 * In the render function, text fields can be accessed like {content.field_name}, relationships are arrays,
 * images are objects {content.image_name.data[0].url}
 *
 * This file is expected to be customized; because of that, it is not overwritten by the integration script.
 * Model and field changes in Zesty.io will not be reflected in this comment.
 *
 * View and Edit this model's current schema on Zesty.io at https://${instanceZUID}.manager.zesty.io/schema/${model.zuid}
 *
 * Data Output Example: https://zesty.org/services/web-engine/introduction-to-parsley/parsley-index#tojson
 * Images API: https://zesty.org/services/media-storage-micro-dam/on-the-fly-media-optimization-and-dynamic-image-manipulation
 */

import React  from 'react';

function ${model.gqlModelName}({ content }) {
    return (
        <>
            {/* Zesty.io Output Example and accessible JSON object for this component. Delete or comment out when needed.  */}
            <h1 dangerouslySetInnerHTML={{__html:content.meta.web.seo_meta_title}}></h1>
            <div>{content.meta.web.seo_meta_description}</div>
            {/* End of Zesty.io output example */}
        </>
    );
}

export default ${model.gqlModelName};
`;

  try {
    await writeFile(path, content);
  } catch (err) {
    console.log(err);
    exit();
  }
}

async function createComponentIndex(dir, models) {
  const file = `${dir}/index.js`;
  const names = models.map((model) => model.gqlModelName);
  // TODO .push('Footer', 'Header') // should we be including these with the starter

  const content = `// generated by lib/sync.js
// This is a required an autogenerated file from the Zesty.io NextJS integration
// This file is overwritten everytime the integration script is run
    
${names.map((name) => `import ${name} from './${name}';`).join('\n')}

export {
  ${names.join(', ')}
}`;

  try {
    await writeFile(file, content);
  } catch (err) {
    console.log(err);
    exit();
  }
}

// process.exit();

/////////////

// // run script: node lib/sync.js
// // reach out to zesty's url map
// // create file structure that maps over the zesty instance
// // in each file, create the script to load props into the file
// const rl = require('readline').createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// async function ask(question) {
//   return new Promise((resolve, reject) => {
//     rl.question(question, (input) => resolve(input));
//   });
// }

// // pseudo code

// // BUILDING COMPONENTS
// // map through each content model: use /-/instant/
// // get content model that matches the model of above item requested
// // create the file for the content model

// // DYNAMICALLY LOAD COMPONENTS INTO PAGE
// // map through the uri requested
// // request the ?toJSON endpoint of the current request path part
// // get the content model zuid: meta > model > zuid
// // load the content model component into the page

// // COMPONENT FILE
// // pass a full content obj of item from ?toJSON response
// // component file will now have passed object to call data within its file
// //

// // ! idea, have  get remote field of this js and one liner run and install, it asks to create npm script shortcut for next time

// // lives as a script file (zesty-config.js ?)
// // for now: can use password param for preview url (readonly)
// // if it creates developer token, need to account for token expiration
// // 0b include needed packages
// const fetch = require('node-fetch');
// const fs = require('fs'); // need to check folder and write files
// const chalk = require('chalk');
// const { promisify } = require('util');
// const { exit } = require('process');
// const writeFileAsync = promisify(fs.writeFile);

// // access doesnt promisfy, needs a custom function
// const accessAsync = (s) =>
//   new Promise((r) => fs.access(s, fs.F_OK, (e) => r(!e)));
// //console output shorthands
// const successMark = `      ${chalk.gray.bold('[')}${chalk.green.bold(
//   'V',
// )}${chalk.gray.bold(']')}`;
// const failMark = `      ${chalk.gray.bold('[')}${chalk.red.bold(
//   'X',
// )}${chalk.gray.bold(']')}`;
// const warningMark = `      ${chalk.gray.bold('[')}${chalk.yellow.bold(
//   'O',
// )}${chalk.gray.bold(']')}`;
// const stageMark = (num) =>
//   `   ${chalk.gray.bold('[')}${chalk.white.bold(num)}${chalk.gray.bold(']')}`;

// // 0a
// // these env var values can be extracted from an initial login, but for now we will
// // prepopulate to get started faster

// // set domain, consider that domains have password protection
// // create next js config is missing
// // add zesty env to it
// // if zesty env missing from js config, add it and instrcut user to populate it
// async function accessNextConfig() {
//   let configPath = process.cwd() + '/next.config.js';

//   // check if next config is there
//   let configExists = await accessAsync(configPath);
//   if (!configExists) {
//     console.log(
//       warningMark + ' Missing NextJS Config, attempting to create the file',
//     );
//     let fileContents = `
// module.exports = {
//     env: {
//         zesty: {
//             "instance_zuid": "", // zesty unique id of content instance
//             "stage" : "", // e.g. https://XYZ-dev.webengine.zesty.io
//             "production" : "", // e.g. https://www.acme.com
//             "stage_password" : "",
//             "auth" : "", // this can set APP_SID as cookie to get access, or a user login
//             "src_dir" : "/src" // where the next project has pages, components, etc folders
//         }
//     }
// }
//           `;
//     try {
//       await writeFileAsync(configPath, fileContents);
//     } catch (e) {
//       console.log(e);
//       exit();
//     }
//   }

//   let nextJSConfig = require(configPath);
//   if (!nextJSConfig.env.hasOwnProperty('zesty')) {
//     nextJSConfig.env.zesty = {
//       instance_zuid: '', // 8-aaeffee09b-7w6v22
//       stage: '', // https://kfg6bckb-dev.webengine.zesty.io
//       production: '', // https://www.zesty.io
//       stage_password: '',
//       auth: '', // this can set APP_SID as cookie to get access, or a user login
//       src_dir: '', // leave blank for /src as default
//     };
//   }
//   let missingValues = false;
//   // enter
//   if (nextJSConfig.env.zesty.instance_zuid == '') {
//     nextJSConfig.env.zesty.instance_zuid = await ask(
//       'Enter the Content Instance ZUID: ',
//     );

//     missingValues = true;
//   }
//   if (nextJSConfig.env.zesty.stage == '') {
//     nextJSConfig.env.zesty.stage = await ask(
//       'Enter Stage Domain e.g. (https://xyz-dev.webengine.zesty.io): ',
//     );
//     missingValues = true;
//   }
//   if (nextJSConfig.env.zesty.production == '') {
//     nextJSConfig.env.zesty.production = await ask(
//       'Enter Production Domain  e.g. (https://www.acme.com): ',
//     );
//     missingValues = true;
//   }
//   if (nextJSConfig.env.zesty.stage_password == '') {
//     nextJSConfig.env.zesty.stage_password = await ask(
//       'Enter Stage Password (hit enter for none): ',
//     );
//     missingValues = true;
//   }
//   if (nextJSConfig.env.zesty.src_dir == '') {
//     nextJSConfig.env.zesty.src_dir = await ask(
//       'Enter source directory (hit enter if root): ',
//     );
//     missingValues = true;
//   }

//   // update the config
//   await writeFileAsync(
//     configPath,
//     'module.exports = ' + JSON.stringify(nextJSConfig, null, 2),
//   );

//   return nextJSConfig.env.zesty;
// }

// // 1
// // spot check variables and

// async function checkVariables(config) {
//   // verify https is or isnt there

//   // output the working directory
//   console.log(
//     `${successMark} Working Project Directory: ${chalk.blue.bold(
//       process.cwd(),
//     )}`,
//   );
//   const workingDir = process.cwd();
//   const srcDir = workingDir + config.src_dir;
//   let success = true;

//   // verify the src_dir exists and is a folder
//   success = await accessAsync(srcDir);
//   if (success) {
//     console.log(
//       `${successMark} Source directory found: ${chalk.blue.bold(srcDir)}`,
//     );
//   } else {
//     console.log(`${failMark} src_dir does not exist: ${srcDir}`);
//     success = false;
//   }

//   // check the domain variables
//   success = await accessAsync(srcDir + '/components/');
//   if (success) {
//     console.log(
//       `${successMark} Components directory found: ${chalk.blue.bold(
//         `${srcDir}/components`,
//       )}`,
//     );
//   } else {
//     console.log(
//       `${failMark} ${srcDir}/components/ directory missing, did you setup NextJS correct?`,
//     );
//     success = false;
//   }

//   // check the domain variables
//   // stage check
//   if (config.hasOwnProperty('stage') && config.stage !== '') {
//     console.log(
//       `${successMark} Stage value present: ${chalk.blue.bold(config.stage)} `,
//     );
//   } else {
//     console.log(
//       chalk.red.bold(
//         `${failMark} 'stage' value missing or empty, set this value to your zesty stage domain e.g. https://xyz-dev.preview.zesty.io`,
//       ),
//     );
//     success = false;
//   }
//   // production check
//   if (config.hasOwnProperty('production') && config.production !== '') {
//     console.log(
//       `${successMark} Production value present: ${chalk.blue.bold(
//         config.production,
//       )} `,
//     );
//   } else {
//     console.log(
//       chalk.red.bold(
//         `${failMark} 'production' value missing, set this value to your zesty production domain e.g. https://www.acme.com`,
//       ),
//     );
//     success = false;
//   }

//   // stage password check
//   if (config.hasOwnProperty('stage_password') && config.stage_password !== '') {
//     console.log(
//       `${successMark} Stage password present: ${chalk.blue.bold('*******')} `,
//     );
//   } else {
//     console.log(
//       `${warningMark} ${chalk.yellow.bold(
//         'Warning!',
//       )} No stage password present, this may cause issues if your zesty instance is password protected.`,
//     );
//   }

//   // stage password check
//   if (config.hasOwnProperty('instance_zuid') && config.instance_zuid !== '') {
//     console.log(
//       `${successMark} Instance ZUID present: ${chalk.blue.bold(
//         config.instance_zuid,
//       )} `,
//     );
//   } else {
//     console.log(
//       `${failMark} ${chalk.yellow.bold(
//         'Warning!',
//       )} Instance ZUID missing, find it at https://accounts.zesty.io/instances`,
//     );
//     success = false;
//   }

//   return success;
// }

// // 2
// // Check network connections and available modes
// async function checkNetworkConnectionsAndModes(config) {
//   let success = true;
//   // make network request to ensure the headless or hybrid mode is turned on, return errors or docs otherwise
//   // note at this point, the CLI cannot verify, ask for sign in, and make the setting change via the api (TODO:but it will!)
//   let stage200URL = formURLWithPassword(
//     config.stage,
//     '',
//     config.stage_password,
//   );
//   try {
//     var res = await fetch(stage200URL);
//   } catch (e) {
//     console.log(
//       chalk.red.bold(
//         'Error with the stage domain: ' +
//           chalk.yellow.bold(config.stage) +
//           ' please fix this value in next.config.js',
//       ),
//     );
//     exit();
//   }
//   if (res.status == 200) {
//     console.log(`${successMark} Stage URL accessible`);
//   } else {
//     console.log(`${failMark} Stage URL did not respond with a 200.`);
//     success = false;
//   }
//   // check if /-/headless/ is available

//   stageHeadlessURL = formURLWithPassword(
//     config.stage,
//     '/-/headless/',
//     config.stage_password,
//   );
//   res = await fetch(stageHeadlessURL);
//   if (res.status == 200) {
//     console.log(`${successMark} Hybrid/Headless Mode is accessible`);
//   } else {
//     console.log(
//       `${failMark} Hybrid/Headless mode needs to be turned on in the instance's setting.`,
//     );
//     success = false;
//   }

//   let prod200URL = config.production;
//   try {
//     res = await fetch(prod200URL);
//   } catch (e) {
//     console.log(
//       chalk.red.bold(
//         'Error with the production domain: ' +
//           chalk.yellow.bold(config.production) +
//           ' please fix this value in next.config.js',
//       ),
//     );
//     exit();
//   }

//   if (res.status == 200) {
//     console.log(`${successMark} Production URL accessible`);
//   } else {
//     console.log(`${failMark} Production URL did not respond with a 200.`);
//     success = false;
//   }

//   let prodHeadlessURL = formURLWithPassword(config.production, '/-/headless/');
//   res = await fetch(prodHeadlessURL);
//   if (res.status == 200) {
//     console.log(`${successMark} Production Hybrid/Headless Mode is accessible`);
//   } else {
//     console.log(
//       `${failMark} Production Hybrid/Headless mode needs to be turned on in the instance's setting.`,
//     );
//     success = false;
//   }

//   return success;
// }

// // 0
// // Run Function connects all functions and outputs console logs

// async function run() {
//   // terminal output of start
//   console.log(`${chalk.gray.bold(' ')}`);
//   console.log(
//     `   ${chalk.gray.bold(
//       '-----------------------------------------------------------------------------',
//     )}`,
//   );
//   console.log(
//     `                          ${chalk
//       .hex('#FF5D0A')
//       .bold('Zesty.io')} ${chalk.gray.bold(
//       'NextJS',
//     )} Integration Script Running`,
//   );
//   console.log(
//     `   ${chalk.gray.bold(
//       '-----------------------------------------------------------------------------',
//     )}`,
//   );
//   console.log(`${chalk.gray.bold(' ')}`);

//   // load config
//   const config = await accessNextConfig();
//   if (config == false) exit();

//   // Step 1 config check
//   console.log(stageMark(1) + ' Config Check');
//   const configCheckSuccess = await checkVariables(config);

//   if (!configCheckSuccess) {
//     finalErrorOutput(
//       ' Config is not setup properly. Verify the values in your next.config.js under the `zesty` object.',
//     );
//     exit();
//   }

//   // Step 2 Network Check
//   console.log(stageMark(2) + ' Network Check');
//   const networkCheckSuccess = await checkNetworkConnectionsAndModes(config);
//   if (!networkCheckSuccess) {
//     finalErrorOutput(
//       'Network tests failed to verified URLs are Zesty.io instance with Headless or Hybrid mode on',
//     );
//     exit();
//   }

//   // Step 3 Create
//   console.log(stageMark(3) + ' File Creation');
//   const createFileSuccess = await createFiles(config);
//   if (!createFileSuccess) {
//     finalErrorOutput(
//       'File creation failed. Check your working directory is correct, and that the script has file write access.',
//     );
//     exit();
//   }

//   // complete exit from script
//   rl.close();
// }

// // run the script

// run();

// // helper functions
// function formURLWithPassword(domain, path, password = '') {
//   let url = domain + path;
//   return password != '' ? url + '?_zpw=' + password : url;
// }

// function finalErrorOutput(message) {
//   console.log(
//     `   ${chalk.red.bold(
//       '-----------------------------------------------------------------------------',
//     )}`,
//   );
//   console.log(`    ${chalk.red.bold(message)} `);
//   console.log(
//     `   ${chalk.red.bold(
//       '-----------------------------------------------------------------------------',
//     )}`,
//   );
// }

////////////////

// // 5a
// // create Footer and Header in zesty models, rename zesty-models to Zesty, update slug, make content props on the model
// // make note of the issue of passing all props and eslint
// // 5 create the catch all dynamic route
// // [[...slug]].js
// // https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes

// // 6 Create ZestyBrowser component which shows in dev instances the model and fields and lets you browse through other model/fields
// // this overlay exists on page
