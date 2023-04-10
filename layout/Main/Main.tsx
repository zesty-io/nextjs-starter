/**
 * The layout/Main/Main.js is included as an example on how to make a global layout for your nextjs project
 * it is installed with MUI, if you unintsall material, replace the container and box components
 * with relative counterparts in whatever design system you chose.
 */

import * as React from 'react';
import { Box, Container } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type MainProps = {
  children: React.ReactNode;
};

const Main = ({ children }: MainProps) => {
  return (
    <Container>
      <header>
        <Header />
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </Container>
  );
};

export default Main;
