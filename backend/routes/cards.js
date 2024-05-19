const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cards');
const {addCard} = require('../middleware/validators')

router.get('/', cardController.getAllCards);

router.post('/', addCard, cardController.createCard);

router.delete('/:cardId', cardController.deleteCard);

router.put('/likes/:cardId', cardController.likeCard);

router.delete('/likes/:cardId', cardController.dislikeCard);

module.exports = router;