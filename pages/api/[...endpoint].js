/*
* Lokasi: pages/api/[...endpoint].js
* Versi: v6
*/

import formidable from 'formidable';
import { getRouteById } from '../../utils/api-parser';
import { jsonResponse, withCorsAndJson } from '../../utils/api-helpers';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const { endpoint } = req.query;
  const endpointId = Array.isArray(endpoint) ? endpoint.join('/') : endpoint;
  const routeModule = getRouteById(endpointId);

  if (!routeModule) {
    return jsonResponse(res, 404, { success: false, message: 'Endpoint not found.' });
  }

  const form = formidable({});
  form.parse(req, (err, fields, files) => {
    if (err) {
      return jsonResponse(res, 500, { success: false, message: 'Failed to parse form data.' });
    }

    setTimeout(() => {
      const responseData = routeModule.response || { info: "No example response defined in metadata." };
      return jsonResponse(res, 200, {
        success: true,
        message: 'Mock response executed successfully.',
        data: responseData,
      });
    }, 1000);
  });
};

export default withCorsAndJson(handler);