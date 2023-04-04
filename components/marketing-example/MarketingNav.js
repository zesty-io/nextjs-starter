import React, { useEffect } from 'react';
import NavItems from './MarketingNavItems.json'
import { useRouter } from 'next/router'
import { Tabs, Tab, Box } from '@mui/material';



export default function MarketingNav(){
    const router = useRouter()
    const [value, setValue] = React.useState(0);
    
    useEffect(() => {
        NavItems.forEach((item, index) => {
            if(item.path == router.asPath) {
                setValue(index)
            }
        });
    }, [router.asPath]);

    return (
        <Box>
            <Tabs value={value} centered>
            {NavItems.map(item => 
                <Tab component="a" key={item.path} onClick={() => router.push(item.path)} label={item.name}></Tab>
            )}
            </Tabs>
        </Box>
    );
}