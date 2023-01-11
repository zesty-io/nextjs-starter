/**
  * Zesty.io Content Model Component
  * When the ZestyLoader [..slug].js file is used, this component will autoload if it associated with the URL
  *
  * Label: A/B
  * Name: a_b_example
  * Model ZUID: 6-8eadb7dcf1-8k1m7j
  * File Created On: Tue Nov 15 2022 08:35:51 GMT-0500 (Eastern Standard Time)
  *
  * Model Fields:
  *
   * title (text)
 * content (wysiwyg_basic)
 * image (images)
  *
  * In the render function, text fields can be accessed like {content.field_name}, relationships are arrays,
  * images are objects {content.image_name.data[0].url}
  *
  * This file is expected to be customized; because of that, it is not overwritten by the integration script.
  * Model and field changes in Zesty.io will not be reflected in this comment.
  *
  * View and Edit this model's current schema on Zesty.io at https://8-80a8a5f897-6wr8s8.manager.zesty.io/schema/6-8eadb7dcf1-8k1m7j
  *
  * Data Output Example: https://zesty.org/services/web-engine/introduction-to-parsley/parsley-index#tojson
  * Images API: https://zesty.org/services/media-storage-micro-dam/on-the-fly-media-optimization-and-dynamic-image-manipulation
  */
 
 import React  from 'react';
 import { Typography, Box, Tabs, Tab, Button} from '@mui/material';
 import OpenInNewIcon from '@mui/icons-material/OpenInNew';
 import GitHubIcon from '@mui/icons-material/GitHub';
 import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
 import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism';
 import TabPanel from 'components/marketing-example/ui/TabPanel'
 import { useRouter } from 'next/router'

 
function tabProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

 function ABExample({ content }) {
    const router = useRouter()
    const startTab = router.query?.UTM_Campaign ? 3 : 0
    const utmOption = router.query?.UTM_Campaign ? content.ab_options.data.find(ab => ab.utm_campaign == router.query.UTM_Campaign) : content;
    const [value, setValue] = React.useState(startTab);
    const optionsTotal = content.ab_options.data.length;
    const [randomNumber, setRandomNumber] = React.useState(getRandomInt(0,(optionsTotal - 1)));
    const [randomClientNumber, setRandomClientNumber] = React.useState(getRandomInt(0,(optionsTotal - 1)));
    const [utmABOption, setUtmABOption] = React.useState(utmOption);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const changeRandomClientNumber = () => {
        setRandomClientNumber(getRandomInt(0,(optionsTotal - 1)))
    }
  
    const viewInGithub = `https://github.com/zesty-io/nextjs-marketing/blob/main/views/zesty/ABExample.js`
    const editInZesty = `https://${process.env.zesty.instance_zuid}.manager.zesty.io/content/${content.meta.model.zuid}/${content.meta.zuid}`
     return (
        <>
            <Box sx={{ mt: 4 }}>
                <Button target="_blank" size="small" startIcon={<GitHubIcon />} sx={{float: 'right', mt: 1, ml:2}} variant="contained" href={viewInGithub}>View in Github</Button>
                <Button target="_blank" size="small" startIcon={<OpenInNewIcon />} sx={{float: 'right', mt: 1}} variant="outlined" href={editInZesty}>Edit Example Zesty</Button>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>A/B Example</Typography>
                <Typography sx={{mb: 3}}>Natively in Zesty A/B Headless Models can be connected to Page Models can deliver ad specific content, random content, or personalized content.
                </Typography>
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Fallback Content" {...tabProps(0)} />
                    <Tab label="Random A/B at Render" {...tabProps(1)} />
                    <Tab label="Client Controled A/B Output" {...tabProps(2)} />
                    <Tab label="UTM Campaign Controled A/B Rendering" {...tabProps(3)} />
                    <Tab label="In Zesty" {...tabProps(4)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Box sx={{ my: 4, px:4, py:2, border: '1px #ccc solid', borderRadius: '5px' }}>
                    <Typography variant="h5" sx={{ my: 2 }}>{content.title}</Typography>
                    <img src={getImageForTemplateExample(content.image)} width="50%" alt={content.title} />
                    <Typography variant="body" sx={{ my: 2 }} dangerouslySetInnerHTML={{__html: content.content}} />
                </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Box sx={{ my: 4, px:4, py:2, border: '1px #ccc solid', borderRadius: '5px' }}>
                    <Typography variant="h5" sx={{ my: 2 }}>{content.ab_options.data[randomNumber].title}</Typography>
                    <img src={getImageForTemplateExample(content.ab_options.data[randomNumber].image)} width="50%" alt={content.ab_options.data[randomNumber].title} />
                    <Typography variant="body" sx={{ my: 2 }} dangerouslySetInnerHTML={{__html: content.ab_options.data[randomNumber].content}} />
                </Box>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Button variant="outlined" sx={{ mr: 3, mt: 3}} onClick={changeRandomClientNumber}>Get Random A/B Test</Button>
                <Box sx={{ my: 4, px:4, py:2, border: '1px #ccc solid', borderRadius: '5px' }}>
                    <Typography variant="h5" sx={{ my: 2 }}>{content.ab_options.data[randomClientNumber].title}</Typography>
                    <img src={getImageForTemplateExample(content.ab_options.data[randomClientNumber].image)} width="50%" alt={content.ab_options.data[randomClientNumber].title} />
                    <Typography variant="body" sx={{ my: 2 }} dangerouslySetInnerHTML={{__html: content.ab_options.data[randomClientNumber].content}} />
                </Box>
            </TabPanel>
            <TabPanel value={value} index={3}>
                {content.ab_options.data.map(ab => <Button startIcon={<OpenInNewIcon/>} key={ab.utm_campaign} variant="outlined" sx={{mr: 3, mt: 3}} component="a" href={`?UTM_Campaign=${ab.utm_campaign}`}>Campaign: {ab.utm_campaign}</Button>)}
                <Button startIcon={<OpenInNewIcon/>} variant="outlined" sx={{mr: 3, mt: 3}} component="a" href={`?UTM_Campaign=`}>Reset</Button>
                
                <Box sx={{ my: 4, px:4, py:2, border: '1px #ccc solid', borderRadius: '5px' }}>
                    <Typography variant="h5" sx={{ my: 2 }}>{utmABOption.title}</Typography>
                    <img src={getImageForTemplateExample(utmABOption.image)} width="50%" alt={utmABOption.title} />
                    <Typography variant="body" sx={{ my: 2 }} dangerouslySetInnerHTML={{__html: utmABOption.content}} />
                </Box>
            </TabPanel>
            <TabPanel value={value} index={4}>
                <div dangerouslySetInnerHTML={{__html: content.zesty_documentation}} />
            </TabPanel>
        </>
     );
 }
 
 export default ABExample;
 