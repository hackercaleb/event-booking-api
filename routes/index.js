const { Router } = require('express');
const artistRoute = require('./artistRoute');
const eventRoute = require('./eventRoute');
const userRoute = require('./userRoute');
const bookingRoute = require('./bookingRoute');

const router = Router();

router.use('/', artistRoute);
router.use('/', eventRoute);
router.use('/', userRoute);
router.use('/', bookingRoute);

module.exports = router;
