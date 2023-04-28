import { Button } from '@mui/material';
import React from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import YouTube from 'react-youtube';

export function CustomLink(props) {
  function onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  const link = props.data.html.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "")
  if(/youtube/i.test(link)){
    let ytid = link.replace('https://www.youtube.com/watch?v=','')
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };
    return <YouTube videoId={ytid} opts={opts} onReady={onReady} />
  }
  // if(/youtube/i.test(link)){
  //  return (<Button color="secondary" startIcon=<YouTubeIcon/> sx={{my:2}} href={link} target="_blank" variant="contained">Watch Video</Button>);
  // } 
  // fall back to normal button
  return <Button sx={{my:2}} href={link} target="_blank" variant="outlined">Open Link</Button>

}