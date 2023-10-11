const { default: mongoose } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, ' please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlenght: 8,
    select: false
  },

  passwordConfirm: {
    type: String,
    required: [true, 'please provide your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not the same'
    }
  },
  changedPasswordAt: Date,
  genre: [
    {
      type: String,
      required: true
    }
  ],
  bio: String
  // You can add more artist-related fields here
});

artistSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

artistSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

artistSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.changedPasswordAt) {
    const changedTimeStamp = parseInt(this.changedPasswordAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimeStamp;
  }

  // false means not changed
  return false;
};

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
