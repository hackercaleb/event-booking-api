const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide a name']
  },
  email: {
    type: String,
    required: [true, 'please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 6,
    select: false
  },
  favouriteGenres: [String],
  favouriteArtists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist'
    }
  ],
  location: String
});

userSchema.pre('save', async function calca(next) {
  if (!this.isModified('password')) return next;
  console.log('Is password modified?', this.isModified(this.password));

  this.password = await bcrypt.hash(this.password, 12);
  console.log('Hashed password:', this.password);
  return next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
