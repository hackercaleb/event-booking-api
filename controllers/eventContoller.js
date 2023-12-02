const Artist = require('../model/artistmodel');
const Booking = require('../model/bookingmodel');

const Event = require('../model/eventmodel');
const AppError = require('../utils/apperror');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/sendEmail');

exports.createEvent = catchAsync(async (req, res, next) => {
  const artistId = req.artist.id;

  const { title, location, date, description, artist, genre } = req.body;

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

// Your deleteEvent function
exports.deleteEvent = catchAsync(async (req, res, next) => {
  // Extract artist id from the token
  const artistId = req.artist.id;

  // Find event in the database
  const event = await Event.findById(req.params.id).populate('bookedUsers');

  // Check if the event exists
  if (!event) {
    return next(new AppError('No Event found with that id', 404));
  }

  // Check if the logged-in artist is the creator of the event
  if (event.artist.toString() !== artistId) {
    return next(new AppError('You are not authorized to cancel this event', 403));
  }

  // Function to cancel an event and send emails to booked users
  const cancelEventAndNotifyUsers = async (eventId) => {
    try {
      // Find the event by its ID
      // const event = await Event.findById(eventId);

      // Check if the event exists and is not already canceled
      if (event && event.status !== 'cancelled') {
        // Update the event status to 'cancelled'
        event.status = 'cancelled';
        await event.save();

        // Find all bookings for the canceled event
        const bookings = await Booking.find({ event: eventId }).populate('user');

        // Use map to create an array of promises for sending emails
        const emailPromises = bookings.map(async (booking) => {
          try {
            await sendEmail({
              email: booking.user.email,
              subject: 'Event Cancellation Confirmation',
              message: `The event "${
                event.title
              }" scheduled on ${event.date.toDateString()} has been cancelled. We apologize for any inconvenience.`
            });
          } catch (error) {
            console.error(`Error sending cancellation email to ${booking.user.email}:`, error);
            // Handle email sending error, maybe log it or retry
          }
        });

        // Use Promise.all to wait for all emails to be sent
        await Promise.all(emailPromises);

        return res.status(200).json({ message: 'Event successfully deleted' });
      }
      return res.status(200).json({ message: 'Event is already cancelled' });
    } catch (error) {
      console.error('Error cancelling event:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Call the cancelEventAndNotifyUsers function with the event ID
  await cancelEventAndNotifyUsers(req.params.id);
});
