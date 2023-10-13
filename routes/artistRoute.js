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
const { protect } = require('../controllers/authcontroller');

const router = Router();

// Authentication routes
router.post('/artist', arrayValidatorRules, validate, signup);
router.post('/artist/login', login);
router.put('/updatePassword', protect, updatePassword);

// Artist routes
router.get('/artists', getAllArtist);
router.get('/artist/:id', getSingleArtist);
router.get('/artistme', protect, getArtistProfile); // Assuming a route for fetching the profile of the currently logged-in artist
router.put('/artist', protect, updateArtist);
router.delete('/artist/', protect, deleteArtist);

module.exports = router;

/*const { Router } = require('express');

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
*/
