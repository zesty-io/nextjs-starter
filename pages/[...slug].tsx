import React from 'react';
import { GetServerSideProps } from 'next';
import { fetchZestyPage } from 'lib/zesty/fetchPage';
import { ZestyView } from '@/components/zesty/ZestyView';

// main is used here, its a base for layout that uses Material UI (mui), delete it if you dont want it, and just return <ZestyView content={props} />
import Main from '@/layout/Main';

// TODO: Improve typing of content returned from fetchZestyPage
type SlugProps = {
  [key: string]: any;
}

export default function Slug(props: SlugProps) {
  return (
    <Main>
      <ZestyView content={props} />
    </Main>
  )
}

// This gets called on every request, its for SSR mode in next
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // zesty fetch
  const data = await fetchZestyPage(ctx.resolvedUrl);

  // add your own custom logic here if needed, set your data to {data.yourData} ...

  // generate a status 404 page
  if (data.error) return { notFound: true };

  // Pass data to the page via props
  return { props: data };
};