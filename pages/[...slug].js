import React from 'react';

import { fetchPage } from '../lib/api';
import { ZestyView } from '../lib/ZestyView';

export default function Slug(props) {
  return <ZestyView content={props} />;
}

// This gets called on every request
export async function getServerSideProps(context) {
  const data = await fetchPage(context.resolvedUrl);

  // if you want to preload other data, like navigation, edit this function

  // Pass data to the page via props
  return { props: data };
}
