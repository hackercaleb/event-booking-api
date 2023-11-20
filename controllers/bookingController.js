const Event = require('../model/eventmodel');
const Booking = require('../model/bookingmodel');
const sendEmail = require('../utils/sendEmail');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apperror');

const createBooking = catchAsync(async (req, res, next) => {
  const { eventId } = req.body;

  // check if eventid is inputed

  if (!eventId) {
    return next(new AppError('Event id is required for the request body', 400));
  }

  //check if the event exist

  const eventexist = await Event.find(eventId);
  if (!eventexist) {
    return next(new AppError('event not found', 404));
  }

  //check if he user book for this event already
  const existingBooking = Booking(
    (booking) => booking.user === req.user && booking.event === eventId
  );

  if (existingBooking) {
    return next(new AppError('User already booked fot this event'));
  }
});
