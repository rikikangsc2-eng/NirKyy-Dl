/*
* Lokasi: pages/api/[endpoint].js
* Versi: v2
*/

import { getRouteById } from '../../utils/api-parser';

export default function handler(req, res) {
  const { endpoint } = req.query;
  const routeModule = getRouteById(endpoint);

  if (!routeModule) {
    return res.status(404).json({ error: 'Endpoint not found.' });
  }

  setTimeout(() => {
    res.status(200).json(routeModule.response);
  }, 1000);
}