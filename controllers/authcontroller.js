const { promisify } = require('util');
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
    return next(new AppError('please provide email and password', 400));
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

exports.protect = catchAsync(async (req, res, next) => {
  //get token and check if it exist

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
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

  if (!currentUser) {
    return next(new AppError('the user does not longer exist', 401));
  }

  //check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('user recently changed password, please login again', 401));
  }

  //grant access to protected routes,
  //req.user = decoded
  (req.artist = currentUser), next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get the user from the collextion
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
});
