const { Router } = require('express');
const artistRoute = require('./artistRoute');
const eventRoute = require('./eventRoute');

const router = Router();

router.use('/', artistRoute);
router.use('/', eventRoute);

module.exports = router;
