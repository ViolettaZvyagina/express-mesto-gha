const Card = require('../models/card');
const {
  SERVER_ERROR_CODE,
  DATA_ERROR_CODE,
  UNFOUND_ERROR_CODE,
} = require('../errors');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.id);
    if (!card) {
      return res.status(UNFOUND_ERROR_CODE).send(({ message: 'Карточка по указанному _id не найдена' }));
    }
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(UNFOUND_ERROR_CODE).send(({ message: 'Карточка по указанному _id не найдена' }));
    }
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
    }
    if (err.name === 'ValidationError') {
      return res.status(DATA_ERROR_CODE).send({ message: ' Переданы некорректные данные для постановки лайка' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(UNFOUND_ERROR_CODE).send(({ message: 'Карточка по указанному _id не найдена' }));
    }
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(DATA_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
    }
    if (err.name === 'ValidationError') {
      return res.status(DATA_ERROR_CODE).send({ message: ' Переданы некорректные данные для снятия лайка' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка', ...err });
  }
};
