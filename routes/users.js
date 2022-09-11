const userRouter = require('express').Router();

const {
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
  getUserProfile,
} = require('../controllers/users');

userRouter.get('/me', getUserProfile);
userRouter.get('/', getUsers);
userRouter.get('/:id', getUserId);
userRouter.patch('/me', updateProfile);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
