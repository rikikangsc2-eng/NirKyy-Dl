/*
* Lokasi: pages/endpoint/[...id].js
* Versi: v6
*/

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getAllRoutes, getRouteById } from '../../utils/api-parser';
import { useAppContext } from '../../context/AppContext';

const PageLoader = () => (
  <div className="page-loader-container">
    <div className="loader"></div>
  </div>
);

const DynamicHomePage = dynamic(() => import('../../components/HomePage'), { loading: PageLoader });

export default function EndpointPage({ endpoint }) {
  const router = useRouter();
  const { setCurrentEndpoint } = useAppContext();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (endpoint) {
      setCurrentEndpoint(endpoint);
    }
  }, [endpoint, setCurrentEndpoint]);

  if (router.isFallback) {
    return <PageLoader />;
  }

  const seo = {
    pageTitle: `${endpoint.name} - NirKyy API Docs`,
    pageDescription: endpoint.description || `Test the ${endpoint.name} endpoint on the NirKyy API platform.`,
    canonicalUrl: `${baseUrl}${router.asPath}`,
    ogImageUrl: `${baseUrl}/api.svg`,
  };

  return (
    <>
      <Head>
        <title>{seo.pageTitle}</title>
        <meta name="description" content={seo.pageDescription} />
        <meta name="keywords" content={`NirKyy API, ${endpoint.name}, ${endpoint.category}, API Documentation`} />
        <meta name="author" content="NirKyy" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={seo.canonicalUrl} />
        <link rel="icon" href="/api.svg" />
        <link rel="apple-touch-icon" href="/api.svg" />
        <meta property="og:title" content={seo.pageTitle} />
        <meta property="og:description" content={seo.pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seo.canonicalUrl} />
        <meta property="og:image" content={seo.ogImageUrl} />
        <meta property="og:site_name" content="NirKyy API Docs" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.pageTitle} />
        <meta name="twitter:description" content={seo.pageDescription} />
        <meta name="twitter:image" content={seo.ogImageUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DynamicHomePage />
    </>
  );
}

export async function getStaticPaths() {
  const docs = getAllRoutes();
  const paths = [];
  Object.values(docs).forEach(category => {
    category.forEach(doc => {
      paths.push({ params: { id: doc.id.split('/') } });
    });
  });
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const id = params.id.join('/');
  const endpoint = getRouteById(id);

  if (!endpoint) {
    return { notFound: true };
  }

  return {
    props: {
      endpoint,
    },
    revalidate: 60,
  };
}