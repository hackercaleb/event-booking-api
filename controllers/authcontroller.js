const jwt = require('jsonwebtoken');
const Artist = require('../model/artistmodel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apperror');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, genre, bio } = req.body;
  const newArtist = await Artist.create({ name, email, password, passwordConfirm, genre, bio });

  // Automatic login
  const token = signToken({ id: newArtist._id });

  res.status(201).json({
    status: 'success',
    token,
    data: { artist: newArtist }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and passport actually exist

  if (!email || !password) {
    return next(new AppError('please provide email and password'), 400);
  }

  //check if the user exist and if the password is correct

  const artist = await Artist.findOne({ email }).select('+password');

  if (!artist || !(await artist.correctPassword(password, artist.password))) {
    return next(new AppError('incorrct email or password', 401));
  }

  // if everything is okay , send the  token  to the client

  const token = signToken(artist._id);
  res.status(201).json({
    status: 'success',
    token
  });
});
