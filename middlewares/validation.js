const validator = require('validator');
const ValidateError = require('../errors/validateError');

module.exports.validateUrl = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new ValidateError('Введите корректный URL-адрес');
};
