const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Artist = require('../model/artistmodel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apperror');
const User = require('../model/usermodel');

const signToken = (id, name, email) =>
  jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, genre, bio } = req.body;
  const newArtist = await Artist.create({ name, email, password, passwordConfirm, genre, bio });
  console.log('New artist ID:', newArtist._id);

  // Automatic login
  const token = signToken(newArtist.id, newArtist.name, newArtist.email);

  return res.status(201).json({
    status: 'success',
    token,
    data: { artist: newArtist }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and passport actually exist
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }

  //check if the user exist and if the password is correct

  const artist = await Artist.findOne({ email }).select('+password');

  if (!artist || !(await artist.correctPassword(password, artist.password))) {
    return next(new AppError('incorrct email or password', 401));
  }

  // if everything is okay , send the  token  to the client

  const token = signToken(artist.id, artist.name, artist.email);

  return res.status(200).json({
    status: 'success',
    token,
    data: {
      artist
    }
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  //get token and check if it exist

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('you are not login,please login to get access.', 401));
  }

  // validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  // check if user still exist

  const currentUser = await Artist.findById(decoded.id);

  console.log('Token decoded:', decoded);
  console.log('Current user:', currentUser);

  if (!currentUser) {
    return next(new AppError('the user does not longer exist', 401));
  }

  //check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('user recently changed password, please login again', 401));
  }

  //grant access to protected routes,

  req.artist = currentUser;
  return next();
});

exports.createUser = catchAsync(async (req, res, next) => {
  // check if email is not already in artist collection to avoid duplicate
  const artistWithEmail = await Artist.findOne({ email: req.body.email });
  if (artistWithEmail) return next(new AppError('Email already registered', 404));

  // creating the user using save method
  const newUser = new User(req.body);
  await newUser.save();

  // ... rest of the code ...
  const token = signToken(newUser.id, newUser.name, newUser.email);

  return res.status(200).json({
    message: 'User created successfully',
    token,
    data: {
      id: newUser._id,
      name: newUser.name
    }
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and passport actually exist
  if (!email || !password) return next(new AppError('please provide an email and password', 400));

  //check if the user exist and if the password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.correctPassword(password, user.password)) {
    return next(new AppError('email or password not found', 404));
  }
  const token = signToken(user.id, user.name, user.email);

  return res.status(200).json({
    message: 'login successful',
    token,
    data: { id: user.id, name: user.name, email: user.email }
  });
});

exports.protectUser = catchAsync(async (req, res, next) => {
  //get token and check if it exists
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  // validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('Decoded Token:', decoded);
  // check if decoded.id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
    return next(new AppError('Invalid user ID in token', 400));
  }

  // store user information in req.user
  req.user = { id: decoded.id.toString(), name: decoded.name, email: decoded.email };
  return next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get the user from the collection
  const artist = await Artist.findById(req.artist.id).select('+password');
  //check if the posted password is correct

  if (!(await artist.correctPassword(req.body.passwordCurrent, artist.password))) {
    return next(new AppError('your current password is wrong', 401));
  }
  //update the password
  artist.password = req.body.password;
  artist.passwordConfirm = req.body.passwordConfirm;

  await artist.save();
  // login user

  // Automatic login
  const token = signToken({ id: artist._id });

  return res.status(200).json({
    status: 'success',
    token,
    data: {
      artist
    }
  });
});
