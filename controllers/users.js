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
    res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', ...err });
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
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', ...err });
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
    if (!name || !about) {
      return res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя', ...err });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', ...err });
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
    if (!avatar) {
      return res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', ...err });
  }
};
