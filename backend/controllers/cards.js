const Card = require('../models/card');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then(cards => res.status(200).json({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((newCard) => {
      if (!newCard) {
        const error = new Error('Falha ao criar um novo cartão');
        error.statusCode = 400;
        throw error;
      }
      res.status(201).json({ data: newCard });
    })
    .catch(next);
};


module.exports.deleteCard = (req, res, next) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  Card.findById(cardId)
    .then(card => {
      if (!card) {
        const error = new Error('Cartão não encontrado');
        error.statusCode = 404;
        throw error;
      }
      if (card.owner.toString() !== userId) {
        const error = new Error('Você não tem permissão para excluir este cartão');
        error.statusCode = 401;
        throw error;
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then(deletedCard => {
      res.status(200).json({ message: 'Cartão deletado com sucesso', data: deletedCard });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Cartão não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then(updatedCard => res.status(200).json({ data: updatedCard }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Cartão não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then(updatedCard => res.status(200).json({ data: updatedCard }))
    .catch(next);
};