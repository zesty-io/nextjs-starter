import React from 'react';
import {Divider } from "@mui/material";

export function CustomDesign(props) {
  // detect specific elements to output custom components
  if(/hr/.test(props.data.html)) {
    return (
      <Divider sx={{mb: 4}} />
    );
  }
  
  return <div dangerouslySetInnerHTML={{ __html: props.data.html }} />
    
}