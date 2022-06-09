import React from 'react'

export default function Homepage({content}){

    return (
        <> 
            <h1>{content.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: content.description }} />
        </> 
    )
}