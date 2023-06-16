# <img src="https://user-images.githubusercontent.com/729972/155242158-157ca88c-9047-4671-bd09-2bbef7035022.png" width="25" style="margin-bottom:-3px"> Zesty.io + Next.js

> Quick start [Next.js](https://nextjs.org/) v13 with [Zesty.io]() as a data source

> If you are using NextJS v12 look at [this starter](https://github.com/zesty-io/nextjs-starter)\_

## Getting Started

0. Requirements

- [Node.js 16](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

1. Install

Run the Next.js marketing

```Bash
npx create-next-app --example https://github.com/zesty-io/nextjs-v13-starter
```

_The install process will let you use an existing account or create a new. When using an existing account you will be prompted to select from your available instances._

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

As you develop your Zesty.io instance you will commonly add new content models. In order for new content pages to render in nextjs, there needs to be a relative model component in `views/zesty` to get the lastest models components you can run a script to sync. Do so by running the following command at the root of your project.

```
npm run sync
```

The sync is performed by the `@zesty-io/nextjs-sync` package. It generates a .env file based off of the zesty configuration files found in the .zesty folder and utilizes that to fetch the models within an instance.

This sync script will create new files where needed, but will not overwrite existing files.

## Working with Zesty View Components

After a `npm run sync` a view component is created for each Zesty Content Model in the `views/zesty` directory. Zesty Content Items that have URL will automatically resolve to the component in that `views` directory that is associated with the content models name.

Each Component loads its data on the server via getServerSideProps by utilizing the exported fetchPageJson from `@zesty-io/nextjs-sync`. This returns a {content} object that is a direct feed of that URLs ?toJSON response. [Read about toJSON](https://zesty.org/services/web-engine/introduction-to-parsley/parsley-index#tojson)

![Diagram showing toJSON data fetching](https://jvsr216n.media.zestyio.com/nextjs-external-delivery-architecture.jpg)

Additionally you can use the provided Typescript utilities to type the content object.

# Custom Integration and the next.config.js file

Here is an explanation of the next.js zesty integration, use this information to setup a custom integration or to modify this marketing in your own project.

**Required files:**

These files should only be modified for customize integrations.

- `pages/[[...zesty]].tsx` - this is a dynamic catch all routes file, hard written paths and files will supersede it. This file will look for content in zesty associated to the requested path `/about/` for example looks for content in zesty that matches the `/about/` path, if it fails to find content it will 404. Instead of 404ing, you can code this to default to your base application component.
- `components/ZestyHead.tsx` Used by ZestyView.tsx, an optional `<head>` component that dynamic sets up meta data for zesty content items that have pages in nextjs.

**Optional Files**

These files can be removed if there references are removed.

- `components/Header.tsx` marketing example file, not needed.
- `components/ZestyTutorial.tsx` marketing example file, not needed.
- `layout/` this directory is used to create a generic page layouts, and can be removed or customized.

### next.config.js

In order for the integration to work, you need `trailingSlash: true`.

```next.config.js
module.exports = {
  trailingSlash: true
}
```

_If trailingSlash needs to be false in your project, then the a custom integration of the `@zesty-io/nextjs-sync` package_

# How to uninstall the Starting Tutorial

The starting tutorial comes with a couple packages and components

- MUI (mui.com)
- Material Icons

### Uninstall Material UI (MUI)

```bash
npm uninstall @mui/material @emotion/react @emotion/styled
```

### Uninstall Material Icons

```bash
npm uninstall @mui/icons-material
```

### Uninstall Lost Pixel

```bash
npm uninstall lost-pixel
```

# How to perform visual testing via LostPixel

Lost pixel comes installed by default.

Go into your lostpixel.config.ts file and add all the pages you want to visual test

```json
 pages: [
      {
        name: "home",
        path: "/",
      },
      {
        name: "articles",
        path: "/articles",
      },
    ],
```

Generate visual baselines for your pages

```bash
  npm run updateBaselines
```

Once your changes are in you can run the test to check for any visual changes

```bash
  npm run visualTest
```
