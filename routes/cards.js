const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(
        /https?:\/\/(www\.)?[\w\W]+#?$/,
      ),
    }),
  }),
  createCard,
);
cardRouter.delete('/:id', deleteCard);
cardRouter.put('/:id/likes', likeCard);
cardRouter.delete('/:id/likes', dislikeCard);

module.exports = cardRouter;
