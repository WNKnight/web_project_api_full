const cors = require('cors');

const allowedOrigins = [
  'http://www.monteirodev.twilightparadox.com',
  'https://www.monteirodev.twilightparadox.com',
  'http://monteirodev.twilightparadox.com',
  'https://monteirodev.twilightparadox.com',
  'http://localhost:3000',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
