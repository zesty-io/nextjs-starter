/**
 * The layout/Main/Main.js is included as an example on how to make a global layout for your nextjs project
 */

import * as React from 'react';
import { Container, CssBaseline } from '@mui/material';
import Header from '@/components/Header';

type MainProps = {
  children: React.ReactNode;
};

const Main = ({ children }: MainProps) => {
  return (
    <>
      <Header />
      <Container sx={{ my: 8 }}>
        <main>{children}</main>
      </Container>
    </>
  );
};

export default Main;
