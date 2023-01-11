/**
  * Zesty.io Content Model Component
  * When the ZestyLoader [..slug].js file is used, this component will autoload if it associated with the URL
  *
  * Label: Personalization
  * Name: personalization
  * Model ZUID: 6-b8d4e3caee-vtg0l9
  * File Created On: Tue Nov 15 2022 09:43:15 GMT-0500 (Eastern Standard Time)
  *
  * Model Fields:
  *
   * title (text)
 * description (wysiwyg_basic)
 * image (images)
  *
  * In the render function, text fields can be accessed like {content.field_name}, relationships are arrays,
  * images are objects {content.image_name.data[0].url}
  *
  * This file is expected to be customized; because of that, it is not overwritten by the integration script.
  * Model and field changes in Zesty.io will not be reflected in this comment.
  *
  * View and Edit this model's current schema on Zesty.io at https://8-80a8a5f897-6wr8s8.manager.zesty.io/schema/6-b8d4e3caee-vtg0l9
  *
  * Data Output Example: https://zesty.org/services/web-engine/introduction-to-parsley/parsley-index#tojson
  * Images API: https://zesty.org/services/media-storage-micro-dam/on-the-fly-media-optimization-and-dynamic-image-manipulation
  */
 
 import React  from 'react';
 import { AutoLayout } from "@zesty-io/react-autolayout";
 import { Typography, Box, Tabs, Tab, Button, Paper, Avatar} from '@mui/material';
 import PropTypes from 'prop-types';
 import TabPanel from 'components/marketing-example/ui/TabPanel'
 import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
 import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism'; 
 import { CustomRow } from "components/marketing-example/personalization/CustomRow";
 import { CustomColumn } from "components/marketing-example/personalization/CustomColumn";
 import { CustomTextarea } from "components/marketing-example/personalization/CustomTextarea";
 import { CustomText } from "components/marketing-example/personalization/CustomText";
 import { CustomLink } from "components/marketing-example/personalization/CustomLink";
 import { CustomImage } from "components/marketing-example/personalization/CustomImage";
 function tabProps(index) {
     return {
     id: `simple-tab-${index}`,
         'aria-controls': `simple-tabpanel-${index}`,
     };
 }

 const codeReferenceForEndpoint = `
{{$persona = empty}} 
{{if {get_var.persona} }}
{{$persona = {get_var.persona} }} 
{{end-if}}
[
    {{each articles as article where find_in_set('{$persona}',article.targeted_personas) }}
    {{article.toJSON()}}
    {{if {article._length} != {article._num} }}, {{end-if}}
    {{end-each}}
]
`

const zestyManagerCodeLink = `https://${process.env.zesty.instance_zuid}.manager.zesty.io/code`;
function personalizatonEndpointURL(persona){
    return `${process.env.zesty.stage}/personalization/articles_by_persona.json?persona=${persona}&zpw=${process.env.zesty.stage_password}`;
}




// this is only needed when a new isntance is created with image urls
 // the tyope string test is what determins that
 // this function should be built into zesty integration
 function getImageForTemplateExample(image){
     if (typeof image === 'string' || image instanceof String){
         return image;
     }
     return image.data[0].url
 }
 
 function Personalization({ content }) {
     const [value, setValue] = React.useState(0);
     const [persona, setPersona] = React.useState(content.personas_to_display.data[0].meta.zuid);
     const [articles, setArticles] = React.useState([]);
     const handleChange = (event, newValue) => {
         setValue(newValue);
     };

     const codeReferenceFetch = `
React.useEffect(() => {
    const fetchArticles = async () => {
        const res = await fetch('${personalizatonEndpointURL(persona)}');
        const data = await res.json()
        setArticles(data)
     }
    
    fetchArticles().catch(console.error);
  },[persona]);
`
 
      // for populating redirects
   React.useEffect(() => {
     const fetchArticles = async () => {
         const res = await fetch(personalizatonEndpointURL(persona));
         const data = await res.json()
         setArticles(data)
      }
     
     fetchArticles().catch(console.error);
   },[persona]);
 
 
 
     return (
         <>
             <Box sx={{ mt: 4 }}>
                 <AutoLayout content={content} components={{
                         "wysiwyg_basic": CustomTextarea,
                         "text": CustomText,
                         "column": CustomColumn,
                         "row": CustomRow,
                         "link": CustomLink,
                         "images": CustomImage                   
                     }} />
             </Box>
             <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                 <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                     
                     <Tab label="Fetching Per Persona" {...tabProps(0)} />
                     <Tab label="Example Data Endpoint" {...tabProps(1)} />
                     <Tab label="In Zesty" {...tabProps(2)} />
                 </Tabs>
             </Box>
         
             <TabPanel value={value} index={0}>
                 <Box sx={{mb:3}}>
                 {content.personas_to_display.data.map(p => <Button 
                     startIcon={<Avatar src={`${getImageForTemplateExample(p.default_avatar)}?width=30`} />}
                     key={p.meta.zuid} 
                     variant={p.meta.zuid !== persona ? `outlined` : `contained`} 
                     sx={{mr: 3, mt: 3}} 
                     onClick={() => setPersona(p.meta.zuid)}>
                     {p.name}
                     </Button>)}
                 </Box>
                 <Typography sx={{mb:2}}>Fetching <strong>{articles.length}</strong> Results for Persona <strong>{persona}</strong></Typography>
                 {articles.map(article => <Paper sx={{p:3}} elevation={2}>
                     <Typography variant="h6">{article.title}</Typography>
                     <img align="right" src={getImageForTemplateExample(article.image)} width="200" />
                     <Typography dangerouslySetInnerHTML={{__html:article.content}} />
                 </Paper>)}
             </TabPanel> 
             <TabPanel value={value} index={1}>
                <Typography>Personalization makes a call to a custom parsley file named "articles_by_persona.json" that returns article by persona ZUID. View this file in the <a href={zestyManagerCodeLink} target="_blank">manager code app</a>.</Typography>
                <SyntaxHighlighter showLineNumbers  language="javascript" style={nord}>
                {codeReferenceForEndpoint}
                </SyntaxHighlighter>
                <Typography>This code creates a fetchable endpoint to <a target="_blank" href={personalizatonEndpointURL(persona)}>{personalizatonEndpointURL(persona)}</a>. This is an exampe react useEffect function call to that endpoint.</Typography>
                <SyntaxHighlighter showLineNumbers  language="javascript" style={nord}>
                {codeReferenceFetch}
                </SyntaxHighlighter>
             </TabPanel>
             <TabPanel value={value} index={2}>
                 <div dangerouslySetInnerHTML={{__html: content.zesty_documentation}} />
             </TabPanel> 
         </>
     );
 }
  
  export default Personalization;
  