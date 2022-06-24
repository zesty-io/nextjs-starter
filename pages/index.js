import React from 'react';
import Slug from './[...slug]';
import { fetchZestyPage } from 'lib/zesty/fetchPage';

function IndexPage(content) {
  return <Slug {...content} />;
}

export default IndexPage;

// This gets called on every request
export async function getServerSideProps(ctx) {
  const data = await fetchZestyPage(ctx.resolvedUrl);

  // Pass data to the page via props
  return { props: data };
}
