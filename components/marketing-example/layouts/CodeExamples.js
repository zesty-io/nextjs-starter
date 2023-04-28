export default [
  {
    name: "Text",
    code: `
    import { Typography } from '@mui/material';
    import React from 'react';

    export function CustomText(props) {
      return (<Typography variant="h1" paddingY={4} sx={{fontWeight: 'bold', fontSize: '7rem', maxWidth: '900px'}}>{props.data.html.replace(/(<([^>]+)>)/gi, "")}</Typography>)
    }
`
  },
  {
    name: "Textarea",
    code: `
    import { Typography } from '@mui/material';
    import React from 'react';
    
    export function CustomTextarea(props) {
       return (<Typography variant="h4" component="p">{props.data.html.replace(/(<([^>]+)>)/gi, "")}</Typography>)
    }`
  },
  {
    name: "CustomLink",
    code: `
    import React from 'react';
    import { Button } from '@mui/material';
    import YouTubeIcon from '@mui/icons-material/YouTube';
    
    export function CustomLink(props) {
      const link = props.data.html.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "")
      if(/youtube/i.test(link)){
       return (<Button color="secondary" startIcon=<YouTubeIcon/> sx={{my:2}} href={link} target="_blank" variant="contained">Watch Video</Button>);
      } 
      // fall back to normal button
      return <Button sx={{my:2}} href={link} target="_blank" variant="outlined">Open Link</Button>
    
    }`
  },
  {
    name: "Images",
    code: `
    import React from 'react';

    import ModalImage from "react-modal-image";  // https://www.npmjs.com/package/react-modal-image
    import styles from './CustomImage.module.css';
    
    export function CustomImage(props) {
      const link = props.data.html.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "")
      
      const largeImage = \`\${link}?saturation=100&orient=hv\`;
      const smallImage = \`\${largeImage}&width=500\`;
    
      return <ModalImage
        className={styles.image}
        small={smallImage}
        large={largeImage}
        showRotate={true}
        alt="Hello World!"
      /> 
    }`
  },
  {
    name: "Design",
    code: `
    import React from 'react';
    import {Divider } from "@mui/material";

    export function CustomDesign(props) {
      // detect specific elements to output custom components
      if(/hr/.test(props.data.html)) {
        return (
          <Divider sx={{mb: 6}} />
        );
      }
      return <div dangerouslySetInnerHTML={{ __html: props.data.html }} />   
    }
    `
  },
  {
    name: "Row",
    code: `
    import React from 'react';
    import {Grid } from "@mui/material";

    export function CustomRow(props) {
      return (
        <Grid container>
          {props.children}
        </Grid>
      );
    }
`
  },
  {
    name: "Column",
    code: `
    import React from 'react';
    import { Grid } from "@mui/material";

    export function CustomColumn(props) {
      return (
        <Grid item md={6} lg={6} xs={12}>
          {props.children}
        </Grid>
      );
    }
`
  }

]