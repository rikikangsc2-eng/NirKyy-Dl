/*
* Lokasi: pages/api/main/pingcheck.js
* Versi: v2
*/

export const metadata = [
  {
    method: 'GET',
    description: 'Mengecek status uptime dan latensi dasar dari server API.',
    parameters: [],
    response: {
      status: "success",
      message: "pong!",
      timestamp: "2023-10-27T10:00:00.000Z"
    }
  },
  {
    method: 'POST',
    description: 'Mengirim pesan ke server dan menerima kembali pesan yang sama (echo).',
    parameters: [
      { name: 'message', type: 'string', desc: 'Pesan yang ingin dikirim.' }
    ],
    examplePayload: {
        message: "hello world"
    },
    response: {
      status: "success",
      echo: "hello world",
      timestamp: "2023-10-27T10:00:00.000Z"
    }
  }
];

export default function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case 'GET':
      res.status(200).json({
        status: 'success',
        message: 'pong!',
        timestamp: new Date().toISOString()
      });
      break;

    case 'POST':
      const message = body.message || 'No message provided';
      res.status(200).json({
        status: 'success',
        echo: message,
        timestamp: new Date().toISOString()
      });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}