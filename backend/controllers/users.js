const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then(users => res.status(200).json({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then(user => res.status(200).json({ data: user }))
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const userIdFromRequest = req.user._id;
  const userIdFromParams = req.params.userId;

  if (userIdFromRequest !== userIdFromParams) {
    return res.status(403).json({ message: 'Acesso proibido: Você não pode editar o perfil de outros usuários' });
  }

  const { name, about } = req.body;

  User.findByIdAndUpdate(userIdFromParams, { name, about }, { new: true })
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then(updatedUser => res.status(200).json({ data: updatedUser }))
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const userIdFromRequest = req.user._id;
  const userIdFromParams = req.params.userId;

  if (userIdFromRequest !== userIdFromParams) {
    return res.status(403).json({ message: 'Acesso proibido: Você não pode mudar o avatar de outros usuários' });
  }

  const { avatar } = req.body;

  User.findByIdAndUpdate(userIdFromParams, { avatar }, { new: true })
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then(updatedUser => res.status(200).json({ data: updatedUser }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao gerar hash da senha:', err);
      return next(err);
    }
    User.create({ name, about, avatar, email, password: hashedPassword })
      .then(newUser => res.status(201).json({ data: newUser }))
      .catch(next);
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
          return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        const token = jwt.sign({ _id: user._id }, 'chave-para-teste', { expiresIn: '7d' }); // NÃO ESQUECER DE MUDAR A CHAVE AQUI PARA A MESMA DE AUTH.JS
        res.status(200).json({ token });
      });
    })
    .catch(next);
};

module.exports.getUserProfile = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.status(200).json({ data: user });
    })
    .catch(next);
};