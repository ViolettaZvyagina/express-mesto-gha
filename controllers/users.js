const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  SERVER_ERROR_CODE,
  DATA_ERROR_CODE,
  UNFOUND_ERROR_CODE,
} = require('../errors');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(UNFOUND_ERROR_CODE).send(({ message: 'Пользователь по указанному _id не найден' }));
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createUser = async (req, res) => {
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
      return res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateProfile = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(UNFOUND_ERROR_CODE).send(({ message: 'Пользователь по указанному _id не найден' }));
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
    }
    if (err.name === 'ValidationError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(UNFOUND_ERROR_CODE).send(({ message: 'Пользователь по указанному _id не найден' }));
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
    }
    if (err.name === 'ValidationError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(UNFOUND_ERROR_CODE).send(({ message: 'Пользователь по указанному _id не найден' }));
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};
