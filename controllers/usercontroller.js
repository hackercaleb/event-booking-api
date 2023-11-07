const User = require('../model/usermodel');
const Artist = require('../model/artistmodel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apperror');

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
exports.getCurrentUser = catchAsync(async (req, res, next) => {
  //get user id from the token
  const userId = req.user.id;
  //find user in the database
  const user = await User.findById(userId);
  //check if the user exist
  if (!user) {
    return next(new AppError('user do not exist', 404));
  }
  //respond with the user information
  return res.status(200).json({
    message: 'successful',
    data: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { name, email, password } = req.body;
  const user = await User.findById(id);
  //check if the user exist
  if (!user) {
    return next(new AppError('user not found', 404));
  }
  //updated new info
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;

  const updatedUser = await user.save();
  //send response
  return res.status(200).json({ message: 'successfully updated', data: { updatedUser } });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  //check if the user exist.
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('user not found', 404));
  }
  await User.findByIdAndDelete(user);
  return res.status(200).json({ message: 'user deleted successfully' });
});
