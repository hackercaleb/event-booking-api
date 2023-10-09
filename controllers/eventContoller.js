const Event = require('../model/eventmodel');
const catchAsync = require('../utils/catchAsync');

exports.createEvent = catchAsync(async (req, res) => {
  const { title, artist, date, location, description } = req.body;

  const newEvent = await Event({ title, artist, date, location, description });

  res.status(201).json({
    message: 'Event created successfully',
    data: {
      title,
      location,
      date
    }
  });
});

exports.getALLevent = async (req, res) => {};

exports.getSingleEvent = async (req, res) => {};

exports.updateEvent = async (req, res) => {};

exports.deleteEvent = async (req, res) => {};
