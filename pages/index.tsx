import React from 'react';
import { GetServerSideProps } from 'next';
import Slug from './[...slug]';
import { fetchZestyPage } from 'lib/zesty/fetchPage';
import { ContentItem } from '@/types';

function IndexPage(content: ContentItem) {
  return <Slug {...content} />;
}

export default IndexPage;

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await fetchZestyPage(ctx.resolvedUrl);

  // Pass data to the page via props
  return { props: data };
};
