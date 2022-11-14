/**
 * ZestyHead.js
 * This file automatically sets meta data associated with zesty content. It is intended to load with slug.
 * Modify this file to suit your needs
 * Logic to load this file is in _document.js, it could also live in _app.js 
 * To have an alternate head, see the logic in _document.js and use next/head there
 */

import React from 'react';
import Head from 'next/head';

export default function ZestyHead({content}) {

  // default OG image, set your own here
  let ogimage = 'https://kfg6bckb.media.zestyio.com/zesty-share-image-generic.png?width=1200'
  // set your own favicon here
  let favicon = 'https://brand.zesty.io/favicon.png'
  // determine if there is a custom og image
  if(content?.og_image){
    ogimage = content.og_image.data[0].url + '?width=1200'
  // if custom og not set, find the first fiedl with image in the name and set that
  } else if (Object.keys(content).find(name => name.includes('image'))){
    let imageKey = Object.keys(content).find(name => name.includes('image'))
    ogimage = content[imageKey]?.data ? content[imageKey].data[0].url + '?width=1200' : ogimage
  }

  // modify the head here
  return (
    <Head>
      <meta charSet="utf-8" />
      <title>{content.meta.web.seo_meta_title}</title>
      <link rel="icon" href={favicon} type="image/png" />
      <link rel="shortcut icon" href={favicon} />
      <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      <meta
        property="og:title"
        content={content.meta.web.seo_meta_title}
      />
      <meta
        name="description"
        content={content.meta.web.seo_meta_description}
      />
      <meta
        property="og:description"
        content={content.meta.web.seo_meta_description}
      />
      <meta 
        property="og:image"
        content={ogimage}
        />

    </Head>
  );
}
