# <img src="https://user-images.githubusercontent.com/729972/155242158-157ca88c-9047-4671-bd09-2bbef7035022.png" width="25" style="margin-bottom:-3px"> Zesty.io + Next.js

> Quick start [Next.js](https://nextjs.org/) v12 with [Zesty.io]() as a data source

## Getting Started

0. Requirements

- [Node.js 16](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

1. Install

```Bash
npx create-next-app --example https://github.com/zesty-io/nextjs-starter
```

*The install process will let you use an existing account or create a new. When using an existing account you will be prompted to select from your available instances.*

2. Change directory to your project

```Bash
# Use the name you chose for your directory
cd my-app
```

3. Start development server

```Bash
npm run dev
```

4. Open application

open browser to http://localhost:3000/

## Syncing Zesty.io Models

As you develop your Zesty.io instance you will commonly add new models. When you want to sync the latest models this is done with the following command at the root of your project.

```
npm run sync
```

This will create new files where needed, but will not overwrite existing files.


## Working with Zesty View Components

After a `npm run sync` a view component is created for each Zesty Content Model in the `views/zesty` directory. Zesty Content Items that have URL will automatically resolve to the component in that `views` directory that is assocaited with the content models name.

Each Component loads with a {content} object, this object is a direct feed of that URLs ?toJSON response.  [Read about toJSON](https://zesty.org/services/web-engine/introduction-to-parsley/parsley-index#tojson)


# How to uninstall the Starting Tutorial

The starting tutorial comes with a couple packages and components

* MUI (mui.com)
* Material Icons
* views/tutorials (directory)

### Uninstall Material UI (MUI)

```bash
npm uninstall @mui/material @mui/styled-engine-sc styled-components
```

### Uninstall Material Icons

```bash
npm uninstall @mui/icons-material
```

### Delete Tutorials

From terminal change directory to project root. 

```bash
rm -Rf views/tutorials
```

Open `pages/index.js` delete the line `import Tutorial from 'views/tutorial/` and the line `<Tutorial/>`

