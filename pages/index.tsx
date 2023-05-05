import React from 'react';
import { GetServerSideProps } from 'next';
import Slug from './[...slug]';
import { fetchPageJson } from "@zesty-io/nextjs-sync";

import { ContentItem } from '@/types';

function IndexPage(content: ContentItem) {
  return <Slug {...content} />;
}

export default IndexPage;

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await fetchPageJson(ctx.resolvedUrl);

  // Pass data to the page via props
  return { props: data };
};
