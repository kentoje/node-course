const express = require('express');
const auth = require('../middleware/auth');
const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');
const Joi = require('joi');
const router = express.Router();
const validate = require('../middleware/validate');

const validateReturn = req => {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(req, schema);
};

router.post('/', [auth, validate(validateReturn)], async (req, res) => {

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found');

  if (rental.dateReturned) return res.status(400).send('return already processed');

  rental.return();
  await rental.save();

  await Movie.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  return res.send(rental);
});

module.exports = router;
