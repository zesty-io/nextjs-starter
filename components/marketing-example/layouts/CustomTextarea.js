import { Typography } from '@mui/material';
import React from 'react';

export function CustomTextarea(props) {
   return (<Typography variant="h4">{props.data.html.replace(/(<([^>]+)>)/gi, "")}</Typography>)
}