const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authorize = require('../middlewares/auth');

router.get('/me', authorize, userController.getUserProfile);

module.exports = router;