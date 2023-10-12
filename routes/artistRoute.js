const { Router } = require('express');

const {
  getAllArtist,
  getSingleArtist,
  getArtistProfile,
  updateArtist,
  deleteArtist
} = require('../controllers/artistcontroller');

const { signup, login, updatePassword } = require('../controllers/authcontroller');

const { arrayValidatorRules } = require('../middleware/arrayValidator');
const { validate } = require('../middleware/validate');

const router = Router();

router.post('/artist', arrayValidatorRules, validate, signup);

router.post('/artist/login', login);

router.get('/artists', getAllArtist);

router.get('/artist/:id', getSingleArtist);

router.get();
router.put();
router.put('/updatePassword', protect, updatePassword);
router.delete();

module.exports = router;
