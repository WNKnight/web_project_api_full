const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authorize = require('../middleware/auth');
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../middleware/validator');

router.get('/', authorize, userController.getAllUsers);

router.get('/me', authorize, userController.getUserProfile);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required()
  })
}), authorize, userController.getUserById);

router.patch('/:userId/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required()
  }),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30)
  })
}), authorize, userController.updateUserProfile);

router.patch('/:userId/me/avatar', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required()
  }),
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL)
  })
}), authorize, userController.updateUserAvatar);

module.exports = router;