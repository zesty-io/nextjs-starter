/**
 * The layout/Main/Main.js is included as an example on how to make a global layout for your nextjs project
 * it is installed with MUI, if you unintsall material, replace the container and box components
 * with relative counterparts in whatever design system you chose.
 */

import * as React from 'react';
import { Box, Container } from '@mui/material';
import Header from 'components/Header';
import Footer from 'components/Footer';

import Head from 'next/head';
const topBarStyles = {
  background: '#eee',
};

const Main = ({ children }) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <Box sx={{ topBarStyles }}>
        <Container>
          <Header />
        </Container>
      </Box>
      <Container>{children}</Container>
      <Box>
        <Container>
          <Footer />
        </Container>
      </Box>
    </>
  );
};

export default Main;
