const express = require('express');
const { register, login, logout, getUser, updateUser } = require('../controllers/authController');
const isVerifiedUser = require('../middlewarers/tokenVerification');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', isVerifiedUser, getUser);
router.put('/user', isVerifiedUser, updateUser);

module.exports = router;
