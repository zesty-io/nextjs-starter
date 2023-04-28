import React from 'react';
import { Grid } from "@mui/material";

export function CustomColumn(props) {
  return (
    <Grid item md={6} lg={6} xs={12}>
      {props.children}
    </Grid>
  );
}