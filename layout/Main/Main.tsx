/**
 * The layout/Main/Main.js is included as an example on how to make a global layout for your nextjs project
 */

import * as React from 'react';
import { Container, CssBaseline } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type MainProps = {
  children: React.ReactNode;
};

const Main = ({ children }: MainProps) => {
  return (
    <>
      <header>
        <Header />
      </header>
      <Container>
        <main>{children}</main>
      </Container>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Main;
