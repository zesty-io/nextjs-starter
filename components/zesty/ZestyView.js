/**
 * Component which dynamically selects the relative content model component view
 */
import React from 'react';
import * as Zesty from 'views/zesty';
import Custom404 from 'pages/404';

export function ZestyView(props) {
  if (props.content.error) {
    return <Custom404 error={props.content} />;
  }
  let modelName = props.content.meta.model_alternate_name
  // check if the model name start with a numberic value, if so prepend N to match component creation name
  if(modelName.match(/^[0-9]/) !== null){
    modelName = 'N' + modelName;
  }
  // dynamically resolves the content models component
  const Component = Zesty[modelName];

  // outside the component near imports
  const initLiveEditor = async (data) => {
    const { ZestyLiveEditor } = await import("@zesty-io/live-editor")
    ZestyLiveEditor(data)
  }

  // inside the component's function just before the return statement
  React.useEffect(() => {
    if(props.content.zestyProductionMode !== true){
      //initLiveEditor(props.content)
    }
  }, [])
  
  return (
    <Component content={props.content} />
  );
}
