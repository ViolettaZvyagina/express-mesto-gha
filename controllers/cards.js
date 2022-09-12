const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const ValidateError = require('../errors/validateError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidateError('Переданы некорректные данные при создании карточки'));
    }
    return next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const card = await Card.findById(req.params.id);
    if (!card) {
      throw new NotFoundError('Карточка по указанному _id не найдена');
    }
    if (card.owner.toString() !== owner) {
      throw new ForbiddenError('Нет прав на удаление карточки');
    }
    await Card.findByIdAndRemove(req.params.id);
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidateError('Передан некорректный id карточки'));
    }
    return next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Карточка по указанному _id не найдена');
    }
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidateError('Передан некорректный id карточки'));
    }
    return next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Карточка по указанному _id не найдена');
    }
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidateError('Передан некорректный id карточки'));
    }
    return next(err);
  }
};
