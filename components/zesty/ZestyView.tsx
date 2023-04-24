/**
 * Component which dynamically selects the relative content model component view
 */
import React, { useEffect } from "react";
import * as Zesty from "@/views/zesty";
import Custom404 from "@/pages/404";
import { ContentItem } from "@/types";

type ZestyViewProps = {
  content: ContentItem;
};

export const ZestyView = (props: ZestyViewProps) => {
  if (props.content.error) {
    return <Custom404 />;
  }
  let modelName = props.content.meta.model_alternate_name;
  // check if the model name starts with a numeric value, if so prepend N to match component creation name
  if (modelName.match(/^[0-9]/) !== null) {
    modelName = "N" + modelName;
  }
  // dynamically resolves the content models component
  const Component = (Zesty as any)[modelName];

  return <Component content={props.content} />;
};
