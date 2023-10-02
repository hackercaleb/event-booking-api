const { Router } = require('express');
const route = require('./route');
const router = Router();

router.use('/', route);

module.exports = router;
