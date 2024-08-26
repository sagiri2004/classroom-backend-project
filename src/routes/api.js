const express = require('express');
const router = express.Router();
const apiController = require('../controllers/ApiController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/register', apiController.register);
router.post('/login', apiController.login);
router.get('/profile', authenticateToken, apiController.profile);
router.get('/refresh-token', apiController.refreshToken);

module.exports = router;