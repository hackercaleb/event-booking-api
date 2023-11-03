const { Router } = require('express');
const artistRoute = require('./artistRoute');
const eventRoute = require('./eventRoute');
const userRoute = require('./userRoute');

const router = Router();

router.use('/', artistRoute);
router.use('/', eventRoute);
router.use('/', userRoute);

module.exports = router;
