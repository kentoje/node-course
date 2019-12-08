const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const { Genre, validate } = require('../models/genres');
const express = require('express');
const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 });
  res.send(genres);
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('Genre was not found');
  res.send(genre);
}));

router.post('/', auth, asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
}));

router.put('/:id', asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const result = await Genre.findByIdAndUpdate( req.params.id, {
    name: req.body.name
  }, { new: true });
  if (!result) return res.status(404).send('The genre with the given ID does not exist');
  res.send(result);
}));

router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID does not exist');
  res.send(genre);
}));

module.exports = router;
