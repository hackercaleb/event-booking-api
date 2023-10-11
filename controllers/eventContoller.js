const Event = require('../model/eventmodel');
const AppError = require('../utils/apperror');
const catchAsync = require('../utils/catchAsync');

exports.createEvent = catchAsync(async (req, res, next) => {
  const artistId = req.artist.id;

  const { title, location, date, description, artist } = req.body;

  const event = await Event.create({ title, location, date, description, artist: artistId });

  res.status(201).json({
    message: 'Event created successfully',
    data: {
      event
    }
  });
});

exports.getAllEvent = catchAsync(async (req, res, next) => {
  // find all the events in the database
  const events = await Event.find().populate('artist', 'id name');

  //prepare the response
  const eventResponse = events.map((event) => {
    return {
      id: event._id,
      title: event.title,
      artist: { id: event.artist._id, name: event.artist.name },
      location: event.location,
      date: event.date,
      description: event.description
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      eventResponse
    }
  });
});

exports.getSingleEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log('ID Parameter:', id); // Log the ID parameter for debugging
  const event = await Event.findById(id);
  console.log('Retrieved Event:', event); // Log the retrieved event for debugging
  if (!event) {
    return next(new AppError('No Event found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      event
    }
  });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
  if (!event) {
    return next(new AppError('No  Event found with that id', 404));
  }
  const requestBody = {
    title: 'Boomplay',
    location: 'Lagos',
    date: '2023-09-27T14:30:00',
    description: 'This is a description'
  };

  const response = {
    message: 'Event updated successfully',
    data: {
      id: 1,
      title: 'Boomplay',
      location: 'Lagos',
      date: '2023-09-27T14:30:00'
    }
  };
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
  if (!event) {
    return next(new AppError('No  Event found with that id', 404));
  }
  const response = {
    message: 'Event deleted successfully'
  };
});
