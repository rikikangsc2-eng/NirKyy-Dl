/*
* Lokasi: pages/api/uptime-status.js
* Versi: v3
*/

import axios from 'axios';
import { jsonResponse, withCorsAndJson } from '../../utils/api-helpers';

const UPTIME_ROBOT_URL = 'https://stats.uptimerobot.com/api/getMonitorList/WYtWiRxmEh';

const handler = async (req, res) => {
  try {
    const cacheBuster = new Date().getTime();
    const targetUrl = `${UPTIME_ROBOT_URL}?page=1&_=${cacheBuster}`;

    const response = await axios.get(targetUrl, {
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://stats.uptimerobot.com/WYtWiRxmEh'
      }
    });

    if (response.data.status !== 'ok') {
      return jsonResponse(res, 502, { success: false, message: 'Failed to retrieve valid data from UptimeRobot.' });
    }

    return jsonResponse(res, 200, { success: true, message: 'Uptime status retrieved successfully.', data: response.data });
  } catch (error) {
    const errorDetails = error.response
      ? { status: error.response.status, data: error.response.data }
      : { message: error.message };
    return jsonResponse(res, 500, { success: false, message: 'An error occurred while fetching uptime status.', data: errorDetails });
  }
};

export default withCorsAndJson(handler);