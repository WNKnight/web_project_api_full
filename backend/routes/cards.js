const express = require('express');
const { celebrate, Joi } = require('celebrate');
const router = express.Router();
const CardController = require('../controllers/cards');
const { validateURL } = require('../middleware/validator');

router.get('/', CardController.getAllCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
    owner: Joi.string().required()
  })
}), CardController.createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
  })
}), CardController.deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
  })
}), CardController.likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
  })
}), CardController.dislikeCard);

module.exports = router;
