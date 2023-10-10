const { Router } = require('express');

const {
  getAllArtist,
  getSingleArtist,
  getArtistProfile,
  updateArtist,
  deleteArtist
} = require('../controllers/artistcontroller');

const { signup, login } = require('../controllers/authcontroller');

const { arrayValidatorRules } = require('../middleware/arrayValidator');
const { validate } = require('../middleware/validate');

const router = Router();

router.post('/artist', arrayValidatorRules, validate, signup);

router.post('/artist/login', login);

router.get('/artists', getAllArtist);

module.exports = router;
