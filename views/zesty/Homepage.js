import ZestyTutorial from 'components/ZestyTutorial'
import React  from 'react';
import { AutoLayout } from "@zesty-io/react-autolayout";
import { Typography, Box, Tabs, Tab, Divider} from '@mui/material';
import PropTypes from 'prop-types';
import TabPanel from 'components/marketing-example/ui/TabPanel'

import { CustomRow } from "components/marketing-example/personalization/CustomRow";
import { CustomColumn } from "components/marketing-example/personalization/CustomColumn";
import { CustomTextarea } from "components/marketing-example/personalization/CustomTextarea";
import { CustomText } from "components/marketing-example/personalization/CustomText";
import { CustomLink } from "components/marketing-example/personalization/CustomLink";
import { CustomImage } from "components/marketing-example/personalization/CustomImage";

export default function Homepage({content}){

    return (
        <> 
           <Box sx={{ mt: 4 }}>
            <AutoLayout content={content} components={{
                    "wysiwyg_advanced": CustomTextarea,
                    "text": CustomText,
                    "column": CustomColumn,
                    "row": CustomRow,
                    "link": CustomLink,
                    "design": ZestyTutorial                   
                }} />
        </Box>
        {/* <Divider/>
            <ZestyTutorial contnet={content}></ZestyTutorial> */}
        </> 
    )
}