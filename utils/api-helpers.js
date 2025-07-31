/*
* Lokasi: utils/api-helpers.js
* Versi: v1
*/

export function jsonResponse(res, statusCode, payload) {
  const { success, message, data } = payload;
  return res.status(statusCode).json({
    author: 'NirKyy',
    success: success,
    message: message,
    data: data || {},
  });
}

export function withCorsAndJson(handler) {
  return async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    try {
      await handler(req, res);
    } catch (error) {
      console.error('Unhandled error in API handler:', error);
      jsonResponse(res, 500, {
        success: false,
        message: 'Internal Server Error.',
        data: { details: error.message },
      });
    }
  };
}