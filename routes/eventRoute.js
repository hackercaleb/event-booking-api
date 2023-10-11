const { Router } = require('express');

const {
  createEvent,
  getAllEvent,
  getSingleEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventContoller');

const { protect } = require('../controllers/authcontroller');

const router = Router();

router.post('/event', protect, createEvent);
router.get('/event/:id', getSingleEvent);
router.get('/events', getAllEvent);

module.exports = router;
