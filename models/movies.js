const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genres');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: genreSchema,
    ref: 'Genre',
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
    default: 0,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
    default: 0,
  }
});

const Movie = mongoose.model('Movie', movieSchema);

const validateMovie = movie => {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).default(0),
    dailyRentalRate: Joi.number().min(0).default(0),
  };
  return Joi.validate(movie, schema);
};

exports.Movie = Movie;
exports.validate = validateMovie;
