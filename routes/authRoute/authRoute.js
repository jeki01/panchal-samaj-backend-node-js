const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController/authController');
const authenticate = require('../../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authController.listOfallUsers);

router.post('/logout', authenticate, authController.logout);

module.exports = router;