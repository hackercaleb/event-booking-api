const { Router } = require('express');
const { createUser, getAllUsers, getSingleUser } = require('../controllers/usercontroller');
const { arrayValidatorRulesUser } = require('../middleware/arrayValidator');
const { validate } = require('../middleware/validate');

const router = Router();
router.post('/users', arrayValidatorRulesUser, validate, createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getSingleUser);

module.exports = router;
