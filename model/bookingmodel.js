const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event Id is required']
  },
  booked_at: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v'
  });

  next();
});

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'event',
    select: '-__v'
  });

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
