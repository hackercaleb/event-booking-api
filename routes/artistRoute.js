const { Router } = require('express');

const {
  createArtist,
  getAllArtist,
  getSingleArtist,
  loginArtist,
  getArtistProfile,
  updateArtist,
  deleteArtist
} = require('../controllers/artistcontroller');

const router = Router();

router.post('/artist', createArtist);

module.exports = router;
