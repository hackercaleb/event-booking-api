const Artist = require('../model/artistmodel');
const catchAsync = require('../utils/catchAsync');

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

exports.getSingleArtist = async (req, res) => {};
exports.getArtistProfile = async (req, res) => {};
exports.updateArtist = async (req, res) => {};
exports.deleteArtist = async (req, res) => {};
