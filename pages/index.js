/*
* Lokasi: pages/index.js
* Versi: v3
*/

import Head from 'next/head';
import fs from 'fs';
import path from 'path';

const getMethodColor = (method) => {
  switch (method) {
    case 'GET': return '#61affe';
    case 'POST': return '#49cc90';
    case 'PUT': return '#fca130';
    case 'DELETE': return '#f93e3e';
    default: return '#ccc';
  }
};

const groupByCategory = (endpoints) => {
  return endpoints.reduce((acc, endpoint) => {
    (acc[endpoint.category] = acc[endpoint.category] || []).push(endpoint);
    return acc;
  }, {});
};

export default function Home({ apiEndpoints }) {
  const groupedEndpoints = groupByCategory(apiEndpoints);

  return (
    <div className="container">
      <Head>
        <title>RESTful API Documentation</title>
        <meta name="description" content="Auto-generated API documentation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>RESTful API</h1>
        <p className="subtitle">Dokumentasi API yang Dihasilkan Secara Otomatis</p>

        {Object.entries(groupedEndpoints).map(([category, endpoints]) => (
          <div key={category} className="category-section">
            <h2>{category}</h2>
            {endpoints.map((endpoint, index) => (
              <div key={index} className="endpoint-card">
                <div className="endpoint-header">
                  <span className="method" style={{ backgroundColor: getMethodColor(endpoint.method) }}>
                    {endpoint.method}
                  </span>
                  <span className="path">{endpoint.path}</span>
                </div>
                <p className="description">{endpoint.description}</p>

                {endpoint.parameters.length > 0 && (
                   <div className="details-section">
                      <h4>Parameters</h4>
                      <ul>
                        {endpoint.parameters.map(p => <li key={p.name}><code>{p.name}</code> ({p.type}): {p.desc}</li>)}
                      </ul>
                   </div>
                )}

                <div className="details-section">
                  <h4>Contoh cURL</h4>
                  <pre><code>{endpoint.curl}</code></pre>
                </div>
                <div className="details-section">
                  <h4>Contoh Respons</h4>
                  <pre><code>{JSON.stringify(endpoint.response, null, 2)}</code></pre>
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>

      <style jsx global>{`
        body {
          background-color: #121212;
          color: #e0e0e0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 0;
        }
      `}</style>
      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
        }
        main h1 {
          font-size: 2.5rem;
          color: #fff;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .subtitle {
          text-align: center;
          color: #a0a0a0;
          margin-top: 0;
          margin-bottom: 3rem;
        }
        .category-section {
          margin-bottom: 3rem;
        }
        .category-section h2 {
          font-size: 1.8rem;
          color: #e0e0e0;
          border-bottom: 2px solid #333;
          padding-bottom: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .endpoint-card {
          background-color: #1e1e1e;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          border: 1px solid #2c2c2c;
          transition: border-color 0.2s ease-in-out;
        }
        .endpoint-card:hover {
          border-color: #4a4a4a;
        }
        .endpoint-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        .method {
          font-weight: bold;
          padding: 0.3rem 0.8rem;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #fff;
          margin-right: 1rem;
        }
        .path {
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
          font-size: 1.1rem;
          color: #c5c8c6;
        }
        .description {
          color: #b0b0b0;
          margin-bottom: 1.5rem;
        }
        .details-section h4 {
          color: #ccc;
          margin-bottom: 0.5rem;
        }
        .details-section ul {
            list-style: none;
            padding: 0;
        }
        .details-section li {
            font-family: 'SF Mono', 'Fira Code', monospace;
            color: #a0a0a0;
            margin-bottom: 0.25rem;
        }
        .details-section li code {
            color: #61affe;
            background-color: #2a2a2a;
            padding: 2px 4px;
            border-radius: 3px;
        }
        pre {
          background-color: #282c34;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        code {
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
          color: #abb2bf;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  const manifestPath = path.join(process.cwd(), 'lib/api-manifest.json');
  let apiEndpoints = [];

  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    apiEndpoints = JSON.parse(manifestContent);
  } catch (error) {
    console.warn('Could not read API manifest. Run build script.');
  }

  return {
    props: {
      apiEndpoints,
    },
  };
}