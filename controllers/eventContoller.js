const Artist = require('../model/artistmodel');
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
  const eventResponse = events.map((event) => ({
    id: event._id,
    title: event.title,
    artist: { id: event.artist._id, name: event.artist.name },
    location: event.location,
    date: event.date,
    description: event.description
  }));

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

  return res.status(200).json({
    status: 'success',
    data: {
      event
    }
  });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
  //extract artist id from the token
  const artistId = req.artist.id;

  //find the event by id
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(new AppError('No  Event found with that id', 404));
  }

  // Check if the logged-in artist is the creator of the event
  if (event.artist.toString() !== artistId) {
    return next(new AppError('You are not authorized to update this event', 403));
  }

  //update only the fields that are present in the request body

  const allowedField = ['title', 'date', 'location', 'description'];
  allowedField.forEach((field) => {
    if (req.body[field] !== undefined) {
      event[field] = req.body[field];
    }
  });

  // Save the updated event
  await event.save();
  // Assuming the update was successful
  return res.status(200).json({
    status: 'success',
    message: 'Event updated successfully',
    data: {
      event
    }
  });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
  //extract id from token
  const artistId = req.artist.id;

  //find event in the database
  const event = await Event.findById(req.params.id);

  //check if it is in the database
  if (!event) {
    return next(new AppError('No  Event found with that id', 404));
  }

  // Check if the logged-in artist is the creator of the event
  if (event.artist.toString() !== artistId) {
    return next(new AppError('You are not authorized to delete this event', 403));
  }

  await Event.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    message: 'Event deleted successfully'
  });
});
