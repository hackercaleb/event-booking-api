const mongoose = require('mongoose');
const Event = require('../model/eventmodel');
const Booking = require('../model/bookingmodel');
//const { protectUser } = require('./authcontroller');

const sendEmail = require('../utils/sendEmail');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apperror');

exports.createBooking = catchAsync(async (req, res, next) => {
  //const { id } = req.user;
  const { eventId } = req.body;

  // check if eventId is provided
  if (!eventId) {
    return next(new AppError('Event id is required for the request body', 400));
  }

  // check if the event exists
  const eventExist = await Event.findById(eventId);
  if (!eventExist) {
    return next(new AppError('Event not found', 404));
  }

  // check if the user already booked for this event
  const existingBooking = await Booking.findOne({
    user: req.user.id, // Assuming user ID is stored in req.user._id
    event: eventId
  });

  if (existingBooking) {
    return next(new AppError('User already booked for this event', 409));
  }

  // create a new booking
  const newBooking = new Booking({
    event: eventId,
    user: req.user.id // Assuming user ID is stored in req.user._id
  });

  await newBooking.save();

  // send email to the user
  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Event Booking Confirmation',
      message: `You have successfully booked ${eventExist.title}. Event details: ${JSON.stringify(
        eventExist
      )}`
    });
  } catch (error) {
    console.error('Error sending email:', error);
    // Handle email sending error, maybe rollback the booking or retry
  }

  // Return success response
  return res.status(201).json({
    message: 'Booking created successfully',
    data: newBooking
  });
});

exports.getBookings = catchAsync(async (req, res, next) => {
  try {
    // filtering by any field in the database
    // build query
    const queryObj = { ...req.query };
    const excludedField = ['limit', 'sort', 'filter'];
    excludedField.forEach((el) => delete queryObj[el]);
    console.log(req.query, queryObj);

    let query = Booking.find(queryObj);

    // validate filter parameter
    if (req.query.filter) {
      if (
        typeof req.query.filter !== 'string' ||
        !mongoose.Types.ObjectId.isValid(req.query.filter)
      ) {
        return next(new AppError('Filter must be a valid ObjectId', 400));
      }
      query = query.where('event').equals(req.query.filter);
    }

    // validate sort parameter
    if (req.query.sort) {
      if (typeof req.query.sort !== 'string') {
        return next(new AppError('Sort must be a string', 400));
      }
      query = query.sort(req.query.sort);
    }

    // validate limit parameter
    if (req.query.limit) {
      const limit = parseInt(req.query.limit, 10);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(limit)) {
        return next(new AppError('Limit must be a number', 400));
      }
      query = query.limit(limit);
    }

    // execute query
    const bookings = await query;

    // send response
    return res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        bookings
      }
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
});
