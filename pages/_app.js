import React from 'react';
import Head from 'next/head';
import ZestyHead from 'components/zesty/ZestyHead';


function MyApp({ Component, pageProps }) {
  return(
    <>
      {/* logic to run zesty head if it detects zesty meta data patterns in props, else load alternate head for you to edit */}
      {pageProps?.meta?.web &&
              <ZestyHead content={pageProps} />
              || 
              <Head>
                <meta charSet="utf-8" />
                <title>Next App</title>   
              </Head>
            }
      <Component {...pageProps} />;
    </>
  )
}

export default MyApp;
