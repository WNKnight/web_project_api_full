const express = require('express');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');

const app = express();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/aroundb')
  .then(() => console.log('Conexão com MongoDB estabelecida com sucesso'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(403).json({ message: 'Acesso não autorizado' });
  }
  next();
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Recurso solicitado não encontrado' });
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});