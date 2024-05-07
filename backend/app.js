const express = require('express');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');
const errorHandle = require('./middleware/errorHandle');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');
const corsMiddleware = require('./middleware/corsMIddleware')

const app = express();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use(corsMiddleware());

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/aroundb')
  .then(() => console.log('Conexão com MongoDB estabelecida com sucesso'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandle);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
