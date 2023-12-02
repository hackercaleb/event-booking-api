const { Router } = require('express');

const {
  createBooking,
  getBookings,
  getSingleBookings,
  deleteBookings
} = require('../controllers/bookingController');

const { protectUser } = require('../controllers/authcontroller');

const router = Router();

router.post('/bookings', protectUser, createBooking);
router.get('/bookings', getBookings);
router.get('/bookings/:id', getSingleBookings);
router.delete('/bookings/:id', protectUser, deleteBookings);

module.exports = router;
