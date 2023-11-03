const User = require('../model/usermodel');
const Artist = require('../model/artistmodel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apperror');

exports.createUser = catchAsync(async (req, res, next) => {
  // check if email is not already in artist collection
  const artistWithEmail = await Artist.findOne({ email: req.body.email });
  if (artistWithEmail) return next(new AppError('Email already registered', 404));

  // creating the user using save method
  const newUser = new User(req.body);
  await newUser.save();

  // ... rest of the code ...

  console.log('Exiting createUser controller');

  return res.status(200).json({
    message: 'User created successfully',
    data: {
      id: newUser._id,
      name: newUser.name
    }
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //send response
  return res.status(200).json({
    message: 'success',
    data: { users }
  });
});

exports.getSingleUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  //check if user does not exist
  if (!user) return next(new AppError('User does not exist', 404));

  //send success response
  return res.status(200).json({
    message: 'success',
    data: { id: user._id, name: user.name, email: user.email }
  });
});
