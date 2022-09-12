const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
  getUserProfile,
} = require('../controllers/users');

userRouter.get('/me', getUserProfile);
userRouter.get('/', getUsers);
userRouter.get(
  '/:id',
  celebrate({
    body: Joi.object().keys({
      id: Joi.string().required().length(24),
    }),
  }),
  getUserId,
);
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required()
        .pattern(
          /https?:\/\/(www\.)?[\w\W]+#?$/,
        ),
    }),
  }),
  updateAvatar,
);

module.exports = userRouter;
