/*
* Lokasi: pages/endpoint/[...id].js
* Versi: v7
*/

export default function EndpointRedirectPage() {
  return null;
}

export async function getServerSideProps({ params }) {
  const id = Array.isArray(params.id) ? params.id.join('/') : params.id;

  return {
    redirect: {
      destination: `/?open=${encodeURIComponent(id)}`,
      permanent: false,
    },
  };
}