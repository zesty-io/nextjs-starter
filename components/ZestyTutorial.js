import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ZestyTutorial(props) {
  return (
    
    <Container>
      <Box align="center" paddingY={3}>
         <Typography align="center" component="p">
         <img src="https://brand.zesty.io/zesty-io-logo-horizontal.svg" alt="zesty logo" height="70"/>
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" style={{margin: '0 0 -5px 40px'}} alt="next.js logo" height="85" />
          <br/>
          Welcome to the Zesty.io Next.js starter!
          
          </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid>
      </Grid>
    </Box>
     </Container>
    
  );
}
