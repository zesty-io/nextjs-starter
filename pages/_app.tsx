import React from 'react';
import Head from 'next/head';
import { ZestyHead } from '@/components/zesty/ZestyHead';
import { createTheme, ThemeProvider } from '@mui/material';
import { Roboto } from 'next/font/google';
import type { AppProps } from 'next/app';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal'],
  subsets: ['latin'],
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* logic to run zesty head if it detects zesty meta data patterns in props, else load alternate head for you to edit */}
      {(pageProps?.meta?.web && <ZestyHead content={pageProps} />) || (
        <Head>
          <meta charSet="utf-8" />
          <title>Zesty.io Next.js Marketing Technology Example Starter</title>
        </Head>
      )}
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
