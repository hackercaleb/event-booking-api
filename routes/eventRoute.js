const { Router } = require('express');

const {
  createEvent,
  getALLevent,
  getSingleEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventContoller');

const router = Router();

router.post('/event', createEvent);
router.get('/event/:id', getSingleEvent);

module.exports = router;
