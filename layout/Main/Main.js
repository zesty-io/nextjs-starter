import React, { useState } from 'react';
import { Box, Container } from '@mui/material'
import Header from 'components/Header';
import Footer from 'components/Footer';
import { ThemeProvider, createTheme } from '@mui/system';
import Head from 'next/head'
const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    action: {
      active: '#001E3C',
    },
    success: {
      dark: '#009688',
    },
  },
});

const topBarStyles = {
    background: '#eee' 
}

const Main = ({
    children
}) => {
    return ( 
        <ThemeProvider theme={theme}>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
            </Head>
            <Box sx={{topBarStyles}}>
                <Container>
                    <Header/>
                </Container>
            </Box>
            <Container >
                
                {children}
                <Box>
                    <Footer/>
                </Box>
            </Container>
        </ThemeProvider>
    )
}


export default Main;