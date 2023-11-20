const { Router } = require('express');

const createBooking = require('../controllers/bookingController');

const { protectUser } = require('../controllers/authcontroller');

const router = Router();

router.post('/bookings', protectUser, createBooking);

module.exports = router;
