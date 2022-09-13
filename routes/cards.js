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
cardRouter.delete(
  '/:id',
  celebrate({
    body: Joi.object().keys({
      id: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteCard,
);
cardRouter.put(
  '/:id/likes',
  celebrate({
    body: Joi.object().keys({
      id: Joi.string().required().length(24).hex(),
    }),
  }),
  likeCard,
);
cardRouter.delete(
  '/:id/likes',
  celebrate({
    body: Joi.object().keys({
      id: Joi.string().required().length(24).hex(),
    }),
  }),
  dislikeCard,
);

module.exports = cardRouter;
