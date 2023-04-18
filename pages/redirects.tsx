import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import Main from '@/layout/Main';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';
const { fetchZestyRedirects } = require('lib/zesty/fetchRedirects');
const zestyConfig = require('zesty.config.json');

type Redirect = {
  source: string;
  destination: string;
};

function tabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const exampleRedirects = `
[
  {
    path: "/erroneous/path/",
    target: "/redirects/",
    code: "301"
  },
  {
    path: "/redirects/bad/path/",
    target: "/redirects/",
    code: "302"
  }
]
`;

export default function Redirects() {
  const [value, setValue] = useState(0);
  const [redirects, setRedirects] = useState<Redirect[]>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // for populating redirects
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchZestyRedirects(zestyConfig);
      setRedirects(data);
    };
    fetchData().catch(console.error);
  }, []);

  const editInZesty = `https://${process.env.zesty.instance_zuid}.manager.zesty.io/seo`;
  const redirectJSONLink = `https://${process.env.zesty.stage}/-/headless/redirects.json`;
  const githubLink = `https://github.com/zesty-io/nextjs-marketing/blob/main/lib/zesty/fetchRedirects.js`;

  return (
    <Main>
      <Box sx={{ mt: 4 }}>
        <Button
          target="_blank"
          size="small"
          startIcon={<GitHubIcon />}
          sx={{ float: 'right', mt: 1, ml: 2 }}
          variant="contained"
          href={githubLink}
        >
          View in Github
        </Button>
        <Button
          target="_blank"
          size="small"
          startIcon={<OpenInNewIcon />}
          sx={{ float: 'right', mt: 1 }}
          variant="outlined"
          href={editInZesty}
        >
          Edit Redirects Zesty
        </Button>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Redirects
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Next.js Zesty starters are integrated to external editing in Zesty out
          of the box. This give marketers autnomy to control their websites
          without developers. Developers follow this guide to connect an
          existing Next.js app to Zesty.io Redirects or launch a Zesty next
          starter.
        </Typography>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="How Redirects Work" {...tabProps(0)} />
          <Tab label="Example Redirects" {...tabProps(1)} />
        </Tabs>
      </Box>
      {value === 0 && (
        <>
          <Typography sx={{ py: 2 }} component="p">
            The Zesty Manager has a marketing accessible interface for editing
            redirects. Access that interface <a href={editInZesty}>here</a>.
          </Typography>
          <Box width="60%" height="250px" position="relative">
            <Image
              src="https://pt9nc6rn.media.zestyio.com/redirects-interface.png?width=800"
              fill
              alt="Zesty.io Redirect Interface"
              style={{ objectFit: 'contain' }}
            />
          </Box>
          <Typography sx={{ py: 2 }} component="p">
            When redirects are created in zesty, they update a dynamic JSON
            endpoint which can be integrated into your app, see the one for this
            project{' '}
            <a href={redirectJSONLink} target="_blank">
              here
            </a>
            .{' '}
          </Typography>
          <Typography variant="h6">Example Redirects JSON Output</Typography>
          <SyntaxHighlighter showLineNumbers language="javascript" style={nord}>
            {exampleRedirects}
          </SyntaxHighlighter>
        </>
      )}
      {value === 1 && (
        <>
          <Typography sx={{ py: 2 }} component="p">
            Live Redirects for this Project
          </Typography>
          {redirects.map((redirect) => {
            return (
              <Box key={redirect.source}>
                <Paper elevation={1} sx={{ p: 2, mb: 5 }}>
                  <Typography>
                    <strong>Target:</strong>{' '}
                    <a href={redirect.source} target="_blank">
                      {redirect.source}
                    </a>
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography>
                    <strong>Destination:</strong> {redirect.destination}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
        </>
      )}
    </Main>
  );
}
