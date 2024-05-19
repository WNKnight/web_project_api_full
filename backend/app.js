const express = require('express');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');
const errorHandle = require('./middleware/errorHandle');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { errors } = require('celebrate');
const {signIn , signUp} = require('./middleware/validators')

var cors = require('cors');

const app = express();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use(express.json());

app.use(cors());
app.options('*', cors());

mongoose.connect('mongodb://localhost:27017/aroundb')
  .then(() => console.log('Conexão com MongoDB estabelecida com sucesso'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor travará agora');
  }, 0);
});

app.post('/signin', signIn, login);
app.post('/signup', signUp, createUser);

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