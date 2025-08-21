const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController/authController');
const authenticate = require('../../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);




router.get('/users', authController.listOfallUsers);
router.post('/logout', authenticate, authController.logout);
router.put('/:userId/toggle-status', authController.toggleUserStatus);
module.exports = router; 