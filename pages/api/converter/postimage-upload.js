/*
* Lokasi: pages/api/converter/postimage-upload.js
* Versi: v1
*/

import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
import * as cheerio from 'cheerio';
import formidable from 'formidable';
import fs from 'fs';
import { withCorsAndJson, jsonResponse } from '../../../utils/api-helpers';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const metadata = {
  name: 'Postimages Uploader',
  category: 'Converter',
  method: 'POST',
  path: '/converter/postimage-upload',
  description: 'Uploads an image from a URL or a direct file to Postimages.org.',
  params: [
    { name: 'url', type: 'text', optional: true, example: null },
    { name: 'file', type: 'file', optional: true }
  ]
};

async function postImagesUploader(buffer, filename = 'image.jpg') {
  const form = new FormData();
  const uploadSession = `${new Date().getTime()}${Math.random().toString().substring(1)}`;
  const uploadReferer = Buffer.from('https://postimages.org/').toString('base64');

  form.append('upload_session', uploadSession);
  form.append('upload_referer', uploadReferer);
  form.append('numfiles', '1');
  form.append('gallery', '');
  form.append('optsize', '0');
  form.append('expire', '0');
  form.append('file', buffer, { filename });

  const uploadResponse = await axios.post('https://postimages.org/json/rr', form, {
    headers: {
      ...form.getHeaders(),
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  if (!uploadResponse.data || uploadResponse.data.status !== 'OK') {
    throw new Error('Upload step 1 failed: Initial upload to server was not successful.');
  }

  const galleryUrl = uploadResponse.data.url;
  const galleryPageResponse = await axios.get(galleryUrl);
  let $ = cheerio.load(galleryPageResponse.data);

  const viewerUrl = $('.thumb a.img').attr('href');
  if (!viewerUrl) {
    throw new Error('Upload step 2 failed: Could not find the viewer page link.');
  }

  const viewerPageResponse = await axios.get(viewerUrl);
  $ = cheerio.load(viewerPageResponse.data);

  const finalImageUrl = $('#main-image').attr('src');
  if (!finalImageUrl) {
    throw new Error('Upload step 3 failed: Could not find the final image link.');
  }

  return { url: finalImageUrl };
}

const handler = async (req, res) => {
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return jsonResponse(res, 500, { success: false, message: 'Failed to parse form data.' });
    }

    try {
      let imageBuffer = null;
      let filename = 'image.jpg';

      const imageUrl = fields.url;
      const uploadedFile = files.file;

      if (imageUrl) {
        try {
          const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          imageBuffer = Buffer.from(response.data);
          filename = path.basename(new URL(imageUrl).pathname) || filename;
        } catch (urlError) {
          return jsonResponse(res, 400, { success: false, message: 'Failed to fetch image from the provided URL. Please check the URL.' });
        }
      } else if (uploadedFile) {
        imageBuffer = fs.readFileSync(uploadedFile.filepath);
        filename = uploadedFile.originalFilename || filename;
      } else {
        return jsonResponse(res, 400, { success: false, message: 'Please provide an image via "url" query or a "file" in the body.' });
      }

      if (!imageBuffer) {
        return jsonResponse(res, 500, { success: false, message: 'Could not get image buffer. Please try again.' });
      }

      const result = await postImagesUploader(imageBuffer, filename);
      return jsonResponse(res, 200, { success: true, message: 'Image uploaded successfully.', data: result });

    } catch (e) {
      return jsonResponse(res, 500, { success: false, message: e.message || 'An unexpected error occurred during image upload.' });
    }
  });
};

export default withCorsAndJson(handler);