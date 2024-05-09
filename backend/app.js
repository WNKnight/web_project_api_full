const express = require('express');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../middleware/validator');
const auth = require('./middleware/auth');
const errorHandle = require('./middleware/errorHandle');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');
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

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  })
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  })
}), login);

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
