const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { UNFOUND_ERROR_CODE } = require('./errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '630a5a6af00ed2ba8d8fe677',
  };

  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(UNFOUND_ERROR_CODE).send({ message: 'Страница не найдена' });
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

main();
