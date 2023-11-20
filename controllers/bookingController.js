const Event = require('../model/eventmodel');
const Booking = require('../model/bookingmodel');
//const { protectUser } = require('./authcontroller');

const sendEmail = require('../utils/sendEmail');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apperror');

const createBooking = catchAsync(async (req, res, next) => {
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

module.exports = createBooking;
