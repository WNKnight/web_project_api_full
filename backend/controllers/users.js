const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then(users => res.status(200).json({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const userIdParams = req.params.userId;
  User.findById(userIdParams)
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then(user => res.status(200).json({ data: user }))
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then(updatedUser => res.status(200).json({ data: updatedUser }))
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then(updatedUser => res.status(200).json({ data: updatedUser }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: 'Esse email já está em uso' });
      } else {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Erro ao gerar hash da senha:', err);
            return next(err);
          }

          User.create({ email, password: hashedPassword })
            .then(newUser => res.status(201).json({ data: newUser }))
            .catch(next);
        });
      }
    })
    .catch(next);
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
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'DevKey', { expiresIn: '7d' });
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
