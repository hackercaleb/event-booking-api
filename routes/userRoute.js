const { Router } = require('express');
const {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  deleteUser,
  updateUser,
  userRecommendation
} = require('../controllers/usercontroller');
const { createUser, loginUser } = require('../controllers/authcontroller');

const { arrayValidatorRulesUser } = require('../middleware/arrayValidator');
const { validate } = require('../middleware/validate');
const { protectUser } = require('../controllers/authcontroller');

const router = Router();
router.post('/users', arrayValidatorRulesUser, validate, createUser);
router.post('/users/login', loginUser);

router.get('/users', getAllUsers);
router.get('/users/me', protectUser, getCurrentUser); // Assuming a route for fetching the profile of the currently logged-in artist
router.get('/users/:id', getSingleUser);
router.get('/user/userrecommendation', protectUser, userRecommendation);

router.put('/user', protectUser, updateUser);

router.delete('/user', protectUser, deleteUser);

module.exports = router;
