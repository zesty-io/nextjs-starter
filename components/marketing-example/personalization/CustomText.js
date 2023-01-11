import { Typography } from '@mui/material';
import React from 'react';

export function CustomText(props) {
   return (<Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>{props.data.html.replace(/(<([^>]+)>)/gi, "")}</Typography>)
}