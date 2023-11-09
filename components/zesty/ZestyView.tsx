"use client";

/**
 * Component which dynamically selects the relative content model component view
 */
import React from "react";
import * as Zesty from "../../views/zesty";
import { ContentItem } from "@/types";
import Header from "../Header";
import { Container } from "@mui/material";

type ZestyViewProps = {
  content: ContentItem;
};

export const ZestyView = ({ content }: ZestyViewProps) => {
  if (content.error || content.notFound) {
    return <div>error 404</div>;
  }
  let modelName = content.meta.model_alternate_name;
  // check if the model name starts with a numeric value, if so prepend N to match component creation name
  if (modelName.match(/^[0-9]/) !== null) {
    modelName = "N" + modelName;
  }
  // dynamically resolves the content models component
  const Component = (Zesty as any)[modelName];

  return (
    <>
      <Header />
      <Container>
        <Component content={content} />;
      </Container>
    </>
  );
};
