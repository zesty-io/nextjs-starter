/**
 * Component which dynamically selects view
 */
import React from 'react';
import * as Zesty from 'views/zesty';
import ZestyHead from 'components/ZestyHead';

import Custom404 from 'pages/404';

export function ZestyView(props) {
  if (props.content.error) {
    return <Custom404 error={props.content} />;
  }
  let modelName = props.content.meta.model_alternate_name
  // check if the model name start with a numberic value, if so prepend N to match component creation name
  if(modelName.match(/^[0-9]/) !== null){
    modelName = 'N' + modelName
  }
  const Component = Zesty[modelName];
  return (
    <>
      <ZestyHead content={props.content} />
      <Component content={props.content} />
    </>
  );
}
