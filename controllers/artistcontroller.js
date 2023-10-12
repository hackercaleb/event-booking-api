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
  //get from token
  const artistId = req.artist.id;

  //find in the database

  const artist = await Artist.findById(artistId);

  //check if the artist exist
  if (!artist) {
    return next(new AppError('artist not found'), 404);
  }

  res
    .status(200)
    .json({
      status: 'success',
      data: { artist: artist._id, name: artist.name, genre: artist.genre, bio: artist.bio }
    });
});

exports.updateArtist = catchAsync(async (req, res, next) => {
  //creAate error if user post password data

  if (req.body.password || req.passwordConfirm) {
    return next(
      new AppError('this route is not for password updates, please use /updatePassword', 400)
    );
  }

  //filtered unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  //update user document

  const updatedArtist = await Artist.findByIdAndUpdate(req.artist.id, filteredBody, {
    new: true,
    runValidators: true
  });
  //send response
  res.status(200).json({
    status: 'success',
    data: {
      artist: updatedArtist
    }
  });
});
exports.deleteArtist = catchAsync(async (req, res) => {
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
  await Artist.findByIdAndDelete(artist);
  await Event.deleteMany({ artist: artistId });
  //send response
  res.status(200).json({
    status: 'success',
    message: 'Artist deleted successfully'
  });
});
