const { default: mongoose } = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, ' please provide your email'],
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  genre: [
    {
      type: String,
      required: true
    }
  ],
  bio: String
  // You can add more artist-related fields here
});
