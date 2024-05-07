const allowedCors = [
  'http://www.monteirodev.twilightparadox.com',
  'https://www.monteirodev.twilightparadox.com',
  'http://monteirodev.twilightparadox.com',
  'https://monteirodev.twilightparadox.com',
  'http://localhost:3000',
];

const corsMiddleware = (req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  next();
};

module.exports = corsMiddleware;
