const { Router } = require('express');

const { createBooking, getBookings } = require('../controllers/bookingController');

const { protectUser } = require('../controllers/authcontroller');

const router = Router();

router.post('/bookings', protectUser, createBooking);
router.get('/bookings', getBookings);

module.exports = router;
