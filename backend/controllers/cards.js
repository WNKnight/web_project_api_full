const Card = require('../models/card');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then(cards => res.status(200).json({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link, owner } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then(newCard => res.status(201).json({ data: newCard }))
    .catch(error => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).json({ message: 'Dados inválidos passados para criar um cartão' });
      } else {
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const cardId = req.params.cardId;
  const userIdFromRequest = req.user._id;

  Card.findById(cardId)
    .then(card => {
      if (!card) {
        const error = new Error('Cartão não encontrado');
        error.statusCode = 404;
        throw error;
      }
      if (card.owner !== userIdFromRequest) {
        const error = new Error('Acesso proibido: Você não pode excluir cartões de outros usuários');
        error.statusCode = 403;
        throw error;
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then(() => res.status(200).json({ message: 'Cartão deletado com sucesso' }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const userId = req.user._id;
  const cardId = req.params.cardId;

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
  const userId = req.user._id;
  const cardId = req.params.cardId;

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
