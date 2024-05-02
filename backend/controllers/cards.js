const Card = require('../models/card');

const ERROR_INVALID_DATA = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).json({ data: cards }))
    .catch(error => {
      console.error('Erro interno do servidor:', error);
      res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link, owner } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then(newCard => res.status(201).json({ data: newCard }))
    .catch(error => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).json({ message: 'Dados inválidos passados para criar um cartão' });
      } else {
        console.error('Erro ao criar cartão:', error);
        res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const cardId = req.params.cardId;
  const userIdFromRequest = req.user._id;

  Card.findById(cardId)
    .then(card => {
      if (!card) {
        return res.status(404).json({ message: 'Cartão não encontrado' });
      }
      if (card.owner !== userIdFromRequest) {
        return res.status(403).json({ message: 'Acesso proibido: Você não pode excluir cartões de outros usuários' });
      }

      Card.findByIdAndDelete(cardId)
        .then(() => res.status(200).json({ message: 'Cartão deletado com sucesso' }))
        .catch(error => {
          console.error('Erro ao excluir cartão:', error);
          res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro ao excluir o cartão' });
        });
    })
    .catch(error => {
      console.error('Erro ao buscar cartão:', error);
      res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro ao buscar o cartão' });
    });
};

module.exports.likeCard = (req, res) => {
  const userId = req.user._id;
  const cardId = req.params.cardId;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Cartão não encontrado');
      error.statusCode = ERROR_NOT_FOUND;
      throw error;
    })
    .then(updatedCard => res.status(200).json({ data: updatedCard }))
    .catch(error => {
      if (error.name === 'DocumentNotFoundError' || error.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).json({ message: 'Cartão não encontrado' });
      } else {
        console.error('Erro interno do servidor:', error);
        res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const userId = req.user._id;
  const cardId = req.params.cardId;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Cartão não encontrado');
      error.statusCode = ERROR_NOT_FOUND;
      throw error;
    })
    .then(updatedCard => res.status(200).json({ data: updatedCard }))
    .catch(error => {
      if (error.name === 'DocumentNotFoundError' || error.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).json({ message: 'Cartão não encontrado' });
      } else {
        console.error('Erro interno do servidor:', error);
        res.status(ERROR_DEFAULT).json({ message: 'Ocorreu um erro no servidor' });
      }
    });
};