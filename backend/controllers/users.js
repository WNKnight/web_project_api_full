const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ERROR_INVALID_DATA = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).json({ data: users }))
    .catch(error => {
      console.error('Erro interno do servidor:', error);
      res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
    });
};

module.exports.getUserById = (req, res) => {
  const userId = req.params.userId;
  User.findById(userId)
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = ERROR_NOT_FOUND;
      throw error;
    })
    .then(user => res.status(200).json({ data: user }))
    .catch(error => {
      if (error.name === 'DocumentNotFoundError' || error.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).json({ message: 'Usuário não encontrado' });
      } else {
        console.error('Erro interno do servidor:', error);
        res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao gerar hash da senha:', err);
      return res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
    }

    User.create({ name, about, avatar, email, password: hashedPassword })
      .then(newUser => res.status(201).json({ data: newUser }))
      .catch(error => {
        if (error.name === 'ValidationError') {
          res.status(ERROR_INVALID_DATA).json({ message: 'Dados inválidos passados para criar um usuário' });
        } else {
          console.error('Erro ao criar usuário:', error);
          res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
        }
      });
  });
};

module.exports.updateUserProfile = (req, res) => {
  const userIdFromRequest = req.user._id;
  const userIdFromParams = req.params.userId;

  if (userIdFromRequest !== userIdFromParams) {
    return res.status(403).json({ message: 'Acesso proibido: Você não pode editar o perfil de outros usuários' });
  }

  const { name, about } = req.body;

  User.findByIdAndUpdate(userIdFromParams, { name, about }, { new: true })
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = ERROR_NOT_FOUND;
      throw error;
    })
    .then(updatedUser => res.status(200).json({ data: updatedUser }))
    .catch(error => {
      if (error.name === 'DocumentNotFoundError' || error.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).json({ message: 'Usuário não encontrado' });
      } else if (error.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).json({ message: 'Dados inválidos passados para atualizar o perfil' });
      } else {
        console.error('Erro interno do servidor:', error);
        res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const userIdFromRequest = req.user._id;
  const userIdFromParams = req.params.userId;

  if (userIdFromRequest !== userIdFromParams) {
    return res.status(403).json({ message: 'Acesso proibido: Você não pode mudar o avatar de outros usuários' });
  }

  const { avatar } = req.body;

  User.findByIdAndUpdate(userIdFromParams, { avatar }, { new: true })
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = ERROR_NOT_FOUND;
      throw error;
    })
    .then(updatedUser => res.status(200).json({ data: updatedUser }))
    .catch(error => {
      if (error.name === 'DocumentNotFoundError' || error.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).json({ message: 'Usuário não encontrado' });
      } else if (error.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).json({ message: 'Dados inválidos passados para atualizar o avatar' });
      } else {
        console.error('Erro interno do servidor:', error);
        res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
      }
    });
};

module.exports.login = (req, res) => {
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
    .catch(error => {
      console.error('Erro ao fazer login:', error);
      res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
    });
};

module.exports.getUserProfile = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.status(200).json({ data: user });
    })
    .catch(error => {
      console.error('Erro ao buscar usuário:', error);
      res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro ao buscar informações do usuário' });
    });
};