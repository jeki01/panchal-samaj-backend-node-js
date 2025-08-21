const express = require('express');
const router = express.Router();

const authController = require('../../controllers/authController/authController');
const authenticate = require('../../middlewares/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

// Protected routes (require login)
router.get('/users', authenticate, authController.listOfallUsers);
router.post('/logout', authenticate, authController.logout);
router.put('/:userId/toggle-status', authenticate, authController.toggleUserStatus);

module.exports = router;
