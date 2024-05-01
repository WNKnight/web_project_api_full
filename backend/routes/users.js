const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');

router.get('/', UserController.getAllUsers);

router.get('/:userId', UserController.getUserById);

router.post('/', UserController.createUser);

router.patch('/:userId/me' , UserController.updateUserProfile);

router.patch('/:userId/me/avatar' , UserController.updateUserAvatar);

module.exports = router;
