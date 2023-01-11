import { Typography } from '@mui/material';
import React from 'react';

export function CustomText(props) {
   return (<Typography variant="h1" paddingY={4} sx={{fontWeight: 'bold', fontSize: '7rem', maxWidth: '900px'}}>{props.data.html.replace(/(<([^>]+)>)/gi, "")}</Typography>)
}