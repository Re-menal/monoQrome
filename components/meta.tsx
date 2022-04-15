import Head from 'next/head';

const Meta = () => {
  return (
    <Head>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <meta property='og:image' content='../public/favicon.ico' />
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:site' content='@Re_menal2' />
      <link
        rel='stylesheet'
        href='https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css'
      ></link>
    </Head>
  );
};

export default Meta;
