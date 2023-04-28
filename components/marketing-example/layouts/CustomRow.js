import React from 'react';
import {Grid } from "@mui/material";

export function CustomRow(props) {
  return (
    <Grid container>
      {props.children}
    </Grid>
  );
}