import { NextPageContext } from 'next';
import React from 'react';

type ErrorProps = {
  statusCode: number | null;
}

const Error = ({ statusCode }: ErrorProps) => {
  return (
    <>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error;