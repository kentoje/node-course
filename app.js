require('dotenv').config();
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const home = require('./routes/home');
const auth = require('./routes/auth');
const logger = require('./middleware/logger');
const mongoose = require('mongoose');

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to the DB'))
  .catch((err) => console.error('Connection failed', err.message));

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);

app.listen(port, () => {
  console.log(`Listening on port ${port} | http://localhost:${port}`);
});
