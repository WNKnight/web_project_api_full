const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/aroundb')
.then(() => console.log('Conexão com MongoDB estabelecida com sucesso'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.use((req, res, next) => {
  req.user = {
    _id: '6603244bb6bf0c6caa97decd'
  };

  next();
});

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Recurso solicitado não encontrado' });
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
