import React from 'react';

import { fetchZestyPage } from 'lib/api';
import { ZestyView } from 'lib/ZestyView';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Main from 'layout/Main';


export default function Slug(props) {
  return (
    <Main>
      <ZestyView content={props} />
    </Main>
  )
}

// This gets called on every request
export async function getServerSideProps(ctx) {
  const data = await fetchZestyPage(ctx.resolvedUrl);
  
  // generate a status 404 page
  if (data.error) return { notFound: true }

  // Pass data to the page via props
  return { props: data };
}
