import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Grid, Paper, Stack, List, ListItemText, ListItem, ListItemIcon, Chip, ListItemButton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import LaunchIcon from '@mui/icons-material/Launch';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const handleClick = (url) => {
  window.open(url, '_blank');
};

export default function ZestyTutorial(props) {
  const managerURL = `https://${process.env.zesty.instance_zuid}.manager.zesty.io`;
  const accountsURL = `https://accounts.zesty.io`;
  const headlessOptions = `${process.env.zesty.stage}/-/headless/`;
  const youtubeTutorial = `https://youtu.be/Y2cux28b9q0?t=183`
  return (
    
    <Container>
      <Box align="center" paddingY={3}>
         <Typography align="center" component="p">
        
          Welcome to the Zesty.io Next.js starter! Learn more from the project read me <a href="https://github.com/zesty-io/nextjs-starter" target="_blank">https://github.com/zesty-io/nextjs-starter</a>
          
          </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
     
      <Grid container spacing={2} paddingY={3}>
        <Grid item md={8} xs={8}>
          <Card sx={{  }}>
            
              <CardMedia
                component="img"
                height="140"
                image="/tutorial/next-js-zesty-docs-header.png"
                alt="next js and zesty docs"
              />
              <CardContent  style={{marginBottom: 0, paddingBottom: 0}}>
              <Typography gutterBottom variant="h6">
                  Project Links
                </Typography>
              <Box padding={0} style={{marginBottom: '10px'}}>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="Open Content Manager"
                    onClick={() => handleClick(managerURL)}
                    icon={<LaunchIcon />}
                    color="primary"
                  />
                  <Chip
                    label="Video Tutorial"
                    onClick={() => handleClick(youtubeTutorial)}
                    icon={<YouTubeIcon />}
                    variant=""
                    color="secondary"
                  />
                    <Chip
                    label="Login to Zesty"
                    onClick={() => handleClick(accountsURL)}
                    icon={<LaunchIcon />}
                    variant="outlined"
                  />

                   <Chip
                    label="More Headless Endpoints"
                    onClick={() => handleClick(headlessOptions)}
                    icon={<LaunchIcon />}
                    variant="outlined"
                  />
                
                </Stack>
              </Box>
                <Typography gutterBottom variant="h6">
                  Getting Started
                </Typography>
                <Typography variant="body1">
                  Zesty.io is a structured cloud CMS geared for web. 
                  When integrated to Next.js, Zesty will dynamically load content to components with writing a fetch request or calling additional functions. 
                  It does this by mapping zesty content model names <i>(you create)</i> to components in the project directory <Chip label="/views/zesty/" />
                </Typography>
                <Typography gutterBottom variant="body1">
                This starter project installs with a <Chip label="Homepage" /> content model, edit that component from <Chip label="/views/zesty/Homepage.js" />
                </Typography>
                <Typography style={{marginBottom: 0, paddingBottom: 0}} variant="h6">
                  Further Documentation
                </Typography>
              </CardContent>
              
              <List dense={false}>
              
                <ListItemButton onClick={(event) => handleClick('https://zesty.org/tools/next.js-integration/zesty-content-object')}>
                  <ListItemIcon>
                    <ArticleIcon />
                  </ListItemIcon>
                  <ListItemText
                      primary="Working with the Zesty {content} Object"
                      secondary={'Learn about the Zesty content object fed to next.js components'}
                    />
                </ListItemButton>
                <ListItemButton onClick={(event) => handleClick('https://zesty.org/tools/next.js-integration/custom-integrations')}>
                  <ListItemIcon>
                    <ArticleIcon />
                  </ListItemIcon>
                  <ListItemText
                      primary="Custom Zesty/Next.js Integrations"
                      secondary={'Understand how Zesty inegrates to Next.js to implement it ot existing projects.'}
                    />
                </ListItemButton>
                <ListItemButton onClick={(event) => handleClick('https://zesty.org/tools/next.js-integration/manager-redirects-in-next.js')}>
                  <ListItemIcon>
                    <ArticleIcon />
                  </ListItemIcon>
                  <ListItemText
                      primary="Working with Redirects"
                      secondary={'How redirects connect from the Zesty manager to your Next.js project.'}
                    />
                </ListItemButton>

                
              </List>
            
          </Card>
         
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ }}>
            <CardActionArea onClick={() => handleClick('https://discord.gg/KYYDy8qYBY')}>
              <CardMedia
                component="img"
                height="140"
                image="/tutorial/discord.png"
                alt="discord header"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Community Chat
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Intereact with the community and Zesty.io developers. Ask questions, share ideas and projects. Click here to be invited.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <br />
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={() => handleClick('https://www.youtube.com/zesty-io')}>
              <CardMedia
                component="img"
                height="140"
                image="/tutorial/youtube.webp"
                alt="youtube header"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  YouTube Channel
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Catch livestream coding sessions and  developer guides on our youtube channel. Subcribe to <a target="_blank" href="https://www.youtube.com/zesty-io">www.youtube.com/zesty-io</a>  
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
     </Container>
    
  );
}
