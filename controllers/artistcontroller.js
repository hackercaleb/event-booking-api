const Artist = require('../model/artistmodel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apperror');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });
  return newObject;
};

exports.getAllArtist = catchAsync(async (req, res, next) => {
  const artists = await Artist.find();

  //send response
  res.status(200).json({
    status: 'success',
    data: {
      artists
    }
  });
});

exports.getSingleArtist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const artist = await Artist.findById(id);
  //check if artist exist
  if (!artist) {
    return next(new AppError('artist not found', 404));
  }

  //return response
  res.status(200).json({
    status: 'success',
    data: {
      id: artist._id,
      name: artist.name,
      genre: artist.genre,
      bio: artist.bio
    }
  });
});

exports.getArtistProfile = catchAsync(async (req, res, next) => {
  // Get artistId from the token
  const artistId = req.artist.id;

  // Find artist in the database
  const artist = await Artist.findById(artistId);

  // Check if the artist exists
  if (!artist) {
    return next(new AppError('Artist not found', 404));
  }

  // Respond with the artist's information
  res.status(200).json({
    status: 'success',
    data: { artist }
  });
});

exports.updateArtist = catchAsync(async (req, res, next) => {
  // Assuming req.artist.id is currently an object
  console.log('Artist ID:', req.artist.id);

  // Create an error if the user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for password updates, please use /updatePassword', 400)
    );
  }

  // Filter unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  try {
    // Update user document
    const updatedArtist = await Artist.findByIdAndUpdate(req.artist.id, filteredBody, {
      new: true,
      runValidators: true
    });

    // Send response
    res.status(200).json({
      status: 'success',
      data: {
        artist: updatedArtist
      }
    });
  } catch (error) {
    // Handle errors, including potential CastErrors
    return next(new AppError('Error updating artist: ' + error.message, 500));
  }
});

exports.deleteArtist = catchAsync(async (req, res, next) => {
  //extract if drom the token
  const artistId = req.artist.id;
  //find the artist by id
  const artist = await Artist.findById(artistId);
  // check if the artist exist
  if (!artist) {
    return next(new AppError('artist do not exist', 404));
  }
  //check if the login artist is the owner of the profile
  if (artist._id.toString() !== artistId) {
    return next(new AppError('you are not authorised to delete this profile', 403));
  }

  // delete artist and event associated
  await Artist.findByIdAndDelete(artistId);
  await Event.deleteMany({ artist: artistId });
  //send response
  res.status(200).json({
    status: 'success',
    message: 'Artist deleted successfully'
  });
});
