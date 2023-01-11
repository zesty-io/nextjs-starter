import { Button } from '@mui/material';
import React from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';

export function CustomLink(props) {
  const link = props.data.html.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "")
  if(/youtube/i.test(link)){
   return (<Button color="secondary" startIcon=<YouTubeIcon/> sx={{my:2}} href={link} target="_blank" variant="contained">Watch Video</Button>);
  } 
  // fall back to normal button
  return <Button sx={{my:2}} href={link} target="_blank" variant="outlined">Open Link</Button>

}