const express = require('express');
const router = express.Router();
const { getMyProfile, getAllUsers } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/me', protect, getMyProfile);
router.get('/all', protect, authorizeRoles('admin'), getAllUsers);

module.exports = router;
