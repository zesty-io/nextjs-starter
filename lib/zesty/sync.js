/**
 * Zesty.io NextJS Sync File
 * Talk to your Zesty.io instance and looks for new content models that do not have a  
 * view component yet in your project, and will create those component and update the 
 * index.js export mapping in `views/zesty/`
 */
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
       title: 'Load zesty.config.json',
       task: async (ctx) => {
         try {
           ctx.nextConfig = await loadZestyNextConfig();
         } catch (error) {
           throw error;
         }
       },
     },
     {
       title: 'Set source directory',
       skip: (ctx) => {
         if (ctx.nextConfig) {
           return 'source directory in zesty.config.json';
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
         if (ctx.nextConfig?.stage_password || ctx.nextConfig?.options?.skip_config_overwrite == true ) {
           return 'instance settings in zesty.config.json';
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
           ctx.token = stdout;
 
           const instance = Object.values(zestyConfig)[0];
 
           ctx.sdk = new SDK(instance.ZUID, ctx.token);
           const verify = await ctx.sdk.auth.verifyToken(ctx.token);
           if (verify.statusCode !== 200) {
             throw new Error(
               `Login using the command: ${chalk.bold('zesty auth:login')}`,
             );
           }
 
           // WebEngine needs to be pinged to add latest settings, particularlly mode and password settings
           // note the cache will need to be reset with a put to settings
           // TODO: we should figure out a better solution, this is brittle
           await fetch(
             `https://${instance.randomHashID}-dev.webengine.zesty.io`,
           );
 
           // get instance settings
           var settings = await fetch(
             `https://${instance.ZUID}.api.zesty.io/v1/env/settings`,
             {
               headers: {
                 Authorization: `Bearer ${ctx.token}`,
               },
             },
           ) .then((res) => res.json())
             .catch((err) => {
               throw new Error('Failed fetching instance settings');
             });
 
           if (settings && Array.isArray(settings.data)) {
 
             settings.data.forEach((setting) => {
               // this make the legacy key:value,key:value option values work by fixing it to key:value;key:value
               // we cleaing the data before it goes to the memory store which allows it to be saved correctly
               if (setting.dataType === 'dropdown') {
                 setting.options = setting.options.replace(/,/g, ';');
               }
             });
             
             // set site_protocol settings to https, it defaults to http
             const site_protocol = settings.data.find(
               (setting) => setting.key === 'site_protocol',
             );
             if(site_protocol){
               await fetch(
                 `https://${instance.ZUID}.api.zesty.io/v1/env/settings/${site_protocol.ZUID}`,
                 {
                   method: 'PUT',
                   headers: {
                     Authorization: `Bearer ${ctx.token}`,
                     'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({
                     ...site_protocol,
                     value: 'https',
                   }),
                 },
               )
                 .then((res) => res.json())
                 .catch((err) => {
                   throw new Error(`Failed updating instance "site_protocol" settings`);
                 });
             }
 
             // after the initial put, we need to refetch settings that were set by webengine, but 
             // only avaiable after a first put (redis cache)
             settings = await fetch(
               `https://${instance.ZUID}.api.zesty.io/v1/env/settings`,
               {
                 headers: {
                   Authorization: `Bearer ${ctx.token}`,
                 },
               },
             ) .then((res) => res.json())
             .catch((err) => {
               throw new Error('Failed fetching instance settings');
             });
             // clean up settings, this needs to be turned into a function with the above request
             settings.data.forEach((setting) => {
               if (setting.dataType === 'dropdown') {
                 setting.options = setting.options.replace(/,/g, ';');
               }
             });
 
             // pull preview lock setting
             const lock = settings.data.find(
               (setting) => setting.key === 'preview_lock_password',
             );
             
             if (lock) {
               // check if there is already a lock value, it not generate a value
               if (lock.value && lock.value !== '') {
                 ctx.stage_password = lock.value;
               } else {
                 ctx.stage_password = Math.random().toString(16).substring(2, 8);
                 await fetch(
                   `https://${instance.ZUID}.api.zesty.io/v1/env/settings/${lock.ZUID}`,
                   {
                     method: 'PUT',
                     headers: {
                       Authorization: `Bearer ${ctx.token}`,
                       'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                       ...lock,
                       value: ctx.stage_password,
                     }),
                   },
                 )
                   .then((res) => res.json())
                   .catch((err) => {
                     throw new Error(`Failed updating instance "lock" settings`);
                   });
               }
             }
 
             // Ensure hybrid or headless is active.
             const mode = settings.data.find(
               (setting) => setting.key === 'mode',
             );
 
             // setup hybrid mode
             if (mode && mode.value === 'traditional') {
               await fetch(
                 `https://${instance.ZUID}.api.zesty.io/v1/env/settings/${mode.ZUID}`,
                 {
                   method: 'PUT',
                   headers: {
                     Authorization: `Bearer ${ctx.token}`,
                     'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({
                     ...mode,
                     value: 'hybrid',
                   }),
                 },
               )
                 .then((res) => res.json())
                 .catch((err) => {
                   throw new Error(`Failed updating instance "mode" settings`);
                 });
             }
 
             // Ensure gql is activated.
             const gql = settings.data.find((setting) => setting.key === 'gql');
             if (!gql || gql.value === '0') {
               const res = await fetch(
                 `https://${instance.ZUID}.api.zesty.io/v1/env/settings/${gql.ZUID}`,
                 {
                   method: 'PUT',
                   headers: {
                     Authorization: `Bearer ${stdout}`,
                   },
                   body: JSON.stringify({
                     ...gql,
                     value: '1'
                   }),
                 },
               ).then((res) => res.json()).catch((err) => {
                 console.log(err)
                 throw new Error(`Failed updating instance "gql" settings`);
               });
             }
             // TODO check gql cors is set?
           }
         } catch (error) {
           throw error;
         }
       },
     },
     {
       title: 'Generate zesty.config.json',
       skip: (ctx) => {
         if (
           ctx.nextConfig?.instance_zuid &&
           ctx.nextConfig?.stage && 
           ctx.nextConfig.stage_password != ''
         ) {
           return 'instance zuid and stage url are in zesty.config.json';
         }
       },
       task: async (ctx) => {
         console.log('context at generation',ctx)
         try {
           const instance = Object.values(zestyConfig)[0];
           console.log('config to write',ctx.nextConfig);
 
           // update in-memory config since we can not reload module
           ctx.nextConfig = {
             instance_zuid: instance.ZUID,
             stage: `https://${instance.randomHashID}-dev.webengine.zesty.io`,
             production: `http://${instance.domain}`,
             src_dir: ctx.src_dir || '',
             stage_password: ctx.stage_password || '',
           };
 
           await writeNextConfig(ctx.nextConfig);
         } catch (error) {
           throw error;
         }
       },
     },
     {
       title: 'Generate components',
       task: async (ctx) => {
         try {
           const steps = await createFiles(ctx.nextConfig);
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
       title: 'Update .gitignore',
       task: async () => {
         try {
           const file = resolve(process.cwd(), '.gitignore');
           const str = await readFile(file, {
             encoding: 'utf-8',
           });
           const parts = str.split('###end');
           if (parts[1]) {
             await writeFile(file, parts[1]);
           }
         } catch (error) {
           throw error;
         }
       },
     },
     {
       title: 'Cleanup',
       task: () => {},
     },
   ]);
 
   tasks.run().catch((err) => {
     // used for debugging
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
   const file = resolve(process.cwd(), 'zesty.config.json');
   try {
     await writeFile(
       file,
       `{
         "instance_zuid": "${config.instance_zuid}",
         "stage": "${config.stage}",
         "production": "${config.production}", 
         "stage_password": "${config.stage_password}",
         "src_dir": "${config.src_dir}",
         "options": {
           "skip_config_overwrite": false, 
           "model_ignore_list": [
             "6-xyz" 
           ]
         }
     }`,
     );
   } catch (error) {
     throw error;
   }
 }
 
 async function loadZestyNextConfig() {
   try {
     const file = resolve(process.cwd(), 'zesty.config.json');
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
 
   // Fetch instance data
   const gql = `${config.stage}/-/gql/?zpw=${config.stage_password}`;
   const gqlJSON = await fetch(gql)
     .then((res) => res.json())
     .catch((err) => {
       throw new Error(`Failed loading gql endpoint: ${gql}`);
     });
 
   // Generate view files
   const steps = [];
   for (const model of gqlJSON.models) {
     // check if model starts with a numeric number, if it does, it needs to start with an alphabet (N) charcter
     if(model.gqlModelName.match(/^[0-9]/) !== null){
       model.gqlModelName = 'N' + model.gqlModelName
     }
 
     // check if the model is on the ignore list in env zesty option, if so, skip it
     if(config.options?.model_ignore_list && config.options.model_ignore_list.find(modelZUID => modelZUID == model.zuid) !== undefined) { 
       steps.push(
         Promise.resolve(`Ignored: ${model.label} [${model.zuid}] is set to be ignored in zesty.config.json`),
       );
       continue; 
     }
 
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
 