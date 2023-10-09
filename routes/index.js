const { Router } = require('express');
const artistRoute = require('../routes/artistRoute');
const artistRoute = require('../routes/eventRoute');

const router = Router();

router.use('/', artistRoute);
router.use('/', EventRoute);

module.exports = router;
