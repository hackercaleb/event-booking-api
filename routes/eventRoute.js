const { Router } = require('express');

const {
  createEvent,
  getALLevent,
  getSingleEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventContoller');

router = Router();
