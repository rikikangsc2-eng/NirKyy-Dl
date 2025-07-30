/*
* Lokasi: pages/api/[endpoint].js
* Versi: v4
*/

import { getRouteById } from '../../utils/api-parser';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (req, res) => {
  const { endpoint } = req.query;
  const routeModule = getRouteById(endpoint);

  if (!routeModule) {
    return res.status(404).json({ error: 'Endpoint not found.' });
  }

  const form = formidable({});
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Failed to parse form data' });
      return;
    }

    setTimeout(() => {
      res.status(200).json(routeModule.response);
    }, 1000);
  });
};

export default allowCors(handler);