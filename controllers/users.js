const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ValidateError = require('../errors/validateError');
const ConflictError = require('../errors/conflictError');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.getUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidateError('Передан некорректный _id пользователя'));
    }
    return next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    return res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidateError('Переданы некорректные данные при создании пользователя'));
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidateError('Передан некорректный _id пользователя'));
    }
    if (err.name === 'ValidationError') {
      next(new ValidateError('Переданы некорректные данные при создании пользователя'));
    }
    return next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidateError('Передан некорректный _id пользователя'));
    }
    if (err.name === 'ValidationError') {
      next(new ValidateError('Переданы некорректные данные при создании пользователя'));
    }
    return next(err);
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new ValidateError('Необходимо заполнить поля email и пароль'));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidateError('Передан некорректный _id пользователя'));
    }
    return next(err);
  }
};
