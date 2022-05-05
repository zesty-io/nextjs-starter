<img src="https://user-images.githubusercontent.com/729972/155242158-157ca88c-9047-4671-bd09-2bbef7035022.png" width="130">

# Zesty.io + NextJS 


## Getting Started

Node and NPM need to be installed. From your command line.

``` Bash
npx create-next-app --example https://github.com/zesty-io/nextjs-starter
```
``` Bash
cd nextjs-starter
```
``` Bash
npm run dev
```

open browser to http://localhost:3000/

## Syncing Zesty.io Models to Next JS

From the command line at the root of the project run:

```
npm run sync
```

or

```
node lib/sync.js
```

This will create new files where needed, but will not overwrite existing files.


## Working with Zesty View Components

After a `npm run sync` a view component is created for each Zesty Content Model in the `views/zesty` directory. Zesty Content Items that have URL will automatically resolve to the component in that `views` directory that is assocaited with the content models name.

Each Component loads with a {content} object, this object is a direct feed of that URLs ?toJSON response.  [Read about toJSON](https://zesty.org/services/web-engine/introduction-to-parsley/parsley-index#tojson)
