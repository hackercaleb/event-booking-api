const Artist = require('../model/artistmodel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apperror');

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
exports.getArtistProfile = async (req, res) => {};
exports.updateArtist = async (req, res, next) => {
  //creAate error if user post password data

  if (req.body.password || req.passwordConfirm) {
    return next(
      new AppError('this route is not for password updates, please use /update my password', 400)
    );
  }

  //update user document
  //send response
  res.status(200).json({
    status: 'success',
    data: {
      artists
    }
  });
};
exports.deleteArtist = async (req, res) => {};
