const mongoose = require('mongoose');
const User = require('../model/usermodel');
const Artist = require('../model/artistmodel');
const Event = require('../model/eventmodel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apperror');

const userHasFavourite = (user) => {
  console.log('Favourite Artists:', user.favouriteArtists);
  console.log('Favourite Genres:', user.favouriteGenres);

  return (
    (user && user.favouriteArtists && user.favouriteArtists.length > 0) ||
    (user && user.favouriteGenres && user.favouriteGenres.length > 0)
  );
};

const filterEvent = async (user) => {
  try {
    const { favouriteArtists = [], favouriteGenres = [] } = user;

    console.log('Filtering events for user:', user._id);
    console.log('Favorite Artists:', favouriteArtists);
    console.log('Favorite Genres:', favouriteGenres);

    // Step 1: Find events by favorite artists
    const eventsByArtist = await Event.find({
      artist: { $in: favouriteArtists }
    });

    console.log('Events by Artist:', eventsByArtist);

    // Step 2: Find events by favorite genres
    const eventsByGenre = await Event.find({
      // Filter events by the user's favorite genre
      $or: [
        { artist: { $in: favouriteArtists }, 'artist.genre': { $in: favouriteGenres } },
        { artist: { $nin: favouriteArtists }, genre: { $in: favouriteGenres } }
      ]
    }).populate('artist'); // Populate the artist field to access the genre

    console.log('Events by Genre:', eventsByGenre);

    // Combine the results
    const events = [...eventsByArtist, ...eventsByGenre];

    console.log('Filtered events:', events);
    return events || []; // Return an empty array if events are undefined
  } catch (error) {
    console.error('Error filtering events:', error);
    throw new AppError('Error filtering events', 500);
  }
};

const shuffleEvent = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

exports.userRecommendation = catchAsync(async (req, res, next) => {
  const queryObj = req.query;

  const user = await User.findById(req.user.id).populate('favouriteArtists favouriteGenres');
  console.log('Populated User:', user);

  if (!userHasFavourite(user)) {
    console.log('No favorite artists or genres found.');
    return res.status(400).json({
      status: 'error',
      message: 'Please update your records with favorite artists and genres.'
    });
  }

  const filteredEvents = await filterEvent(user);
  console.log('Filtered events:', filteredEvents);

  const limit = parseInt(req.query.limit, 10) || 5;
  const shuffledEvents = shuffleEvent(filteredEvents).slice(0, limit);

  return res.json(shuffledEvents);
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
