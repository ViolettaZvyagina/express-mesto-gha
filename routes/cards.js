const cardRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:id', deleteCard);
cardRouter.put('/:id/likes', likeCard);
cardRouter.delete('/:id/likes', dislikeCard);

module.exports = cardRouter;
