const express = require('express');
const router = express.Router();
const {getAllUsers,getUserProfile,getUserById,updateUserProfile,updateUserAvatar} = require('../controllers/users');
const {updateProfile , updateAvatar} = require('../middleware/validators')


router.get('/', getAllUsers);

router.get('/me', getUserProfile);

router.get('/:userId', getUserById);

router.patch('/me', updateProfile, updateUserProfile);

router.patch('/me/avatar', updateAvatar, updateUserAvatar);

module.exports = router;
