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

router.post('/events', protect, createEvent);
router.get('/events/:id', getSingleEvent);
router.get('/events', getAllEvent);
router.put('/events/:id', protect, updateEvent);
router.delete('/events/:id', protect, deleteEvent);

module.exports = router;
