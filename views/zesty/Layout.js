/**
  * Zesty.io Content Model Component
  * When the ZestyLoader [..slug].js file is used, this component will autoload if it associated with the URL
  *
  * Label: Layouts
  * Name: layouts
  * Model ZUID: 6-d6b2919db2-b7wnxb
  * File Created On: Mon Nov 14 2022 14:20:32 GMT-0500 (Eastern Standard Time)
  *
  * Model Fields:
  *
   * title (text)
 * rich_text (wysiwyg_basic)
 * image (images)
 * image_wide (images)
 * external_url (link)
  *
  * In the render function, text fields can be accessed like {content.field_name}, relationships are arrays,
  * images are objects {content.image_name.data[0].url}
  *
  * This file is expected to be customized; because of that, it is not overwritten by the integration script.
  * Model and field changes in Zesty.io will not be reflected in this comment.
  *
  * View and Edit this model's current schema on Zesty.io at https://8-80a8a5f897-6wr8s8.manager.zesty.io/schema/6-d6b2919db2-b7wnxb
  *
  * Data Output Example: https://zesty.org/services/web-engine/introduction-to-parsley/parsley-index#tojson
  * Images API: https://zesty.org/services/media-storage-micro-dam/on-the-fly-media-optimization-and-dynamic-image-manipulation
  */
 
const codeStringNoComponents = `
import { AutoLayout } from "@zesty-io/react-autolayout";

<AutoLayout content={content} />
`

const codeStringWithComponents = `
import React from "react";
 
import { AutoLayout } from "@zesty-io/react-autolayout";
import { CustomTextarea } from "./CustomTextarea";
import { CustomColumn } from "./CustomColumn";
import { CustomRow } from "./CustomRow";
 
export default function Page({ content }) {
    <AutoLayout content={content} components={{
        "wysiwyg_basic": CustomTextarea,
        "text": CustomText,
        "column": CustomColumn,
        "row": CustomRow,
        "design": CustomDesign,
        "link": CustomLink   
    }} />
}
`;


import React  from 'react';
import { AutoLayout } from "@zesty-io/react-autolayout";
import { Typography, Box, Tabs, Tab, Button} from '@mui/material';
import PropTypes from 'prop-types';
import { CustomRow } from "components/marketing-example/layouts/CustomRow";
import { CustomColumn } from "components/marketing-example/layouts/CustomColumn";
import { CustomTextarea } from "components/marketing-example/layouts/CustomTextarea";
import { CustomText } from "components/marketing-example/layouts/CustomText";
import { CustomLink } from "components/marketing-example/layouts/CustomLink";
import { CustomImage } from "components/marketing-example/layouts/CustomImage";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CustomDesign } from 'components/marketing-example/layouts/CustomDesign';
import TabPanel from 'components/marketing-example/ui/TabPanel'
import examples from 'components/marketing-example/layouts/CodeExamples';

  
  function tabProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function Layout({ content }) {
    const [value, setValue] = React.useState(0);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    const editInZesty = `https://${process.env.zesty.instance_zuid}.manager.zesty.io/app/80-d8abaff6ef-wxs830`

    return (
        <>
        
            <Box sx={{ mt: 4 }}>
            
                <Button target="_blank" size="small" startIcon={<GitHubIcon />} sx={{float: 'right', mt: 1, ml:2}} variant="contained" href={`https://github.com/zesty-io/nextjs-marketing/blob/94dc752b895e7674afabbc4fea63f0d15a203385/views/zesty/Layout.js#L57`}>View in Github</Button>
                <Button target="_blank" size="small" startIcon={<OpenInNewIcon />} sx={{float: 'right', mt: 1}} variant="outlined" href={editInZesty}>Edit Layouts Zesty</Button>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>Layouts</Typography>
                <Typography sx={{mb: 3}}>Layouts is drag-n-drop experience for Marketers to control the layout of their pages. 
                        Layouts is installed from the <a href="https://www.zesty.io/marketplace/">Zesty Marketplace</a> and setup in next.js with 
                        an npm package <a href="https://www.npmjs.com/package/@zesty-io/react-autolayout">React Auto Layout by Zesty.io</a>
                </Typography>
                
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Basic Example" {...tabProps(0)} />
                    <Tab label="With Custom Components" {...tabProps(1)} />
                    <Tab label="Component Examples" {...tabProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Box sx={{ my: 4, p:2, border: '1px #ccc solid', borderRadius: '5px' }}>
                    <AutoLayout content={content}  />
                </Box>
                <Typography variant="h5" sx={{ my: 2 }}>Code Example</Typography>
                <SyntaxHighlighter showLineNumbers  language="javascript" style={nord}>
                    {codeStringNoComponents}
                </SyntaxHighlighter>
            </TabPanel>
            <TabPanel value={value} index={1}>
            
                <Box sx={{ my: 4, px:4, pb:5, border: '1px #ccc solid', borderRadius: '5px' }}>
                    <AutoLayout content={content} components={{
                            "wysiwyg_basic": CustomTextarea,
                            "text": CustomText,
                            "column": CustomColumn,
                            "row": CustomRow,
                            "design": CustomDesign,
                            "link": CustomLink,
                            "images": CustomImage                   
                        }} />
                </Box>
                <Typography variant="h5" sx={{ my: 2 }}>Code Example with Custom Components</Typography>
                <SyntaxHighlighter showLineNumbers  language="javascript" style={nord}>
                    {codeStringWithComponents}
                </SyntaxHighlighter>
            </TabPanel>
            <TabPanel value={value} index={2}>
                {examples.map(example => <Box key={example.name}>
                    <Typography variant="h5" sx={{ my: 2 }}>Code Example for {example.name} Components</Typography>
                    <SyntaxHighlighter showLineNumbers  language="javascript" style={nord}>
                        {example.code}
                    </SyntaxHighlighter>
                </Box>)}
            </TabPanel>
            
            
        </>
     );
 }
 
 