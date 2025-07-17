const express = require('express');
const  LoginController = require('../controllers/login')
const router = express.Router();


router.post('/auth', LoginController.auth);
router.post('/callback', LoginController.callback);
router.post('/logout', LoginController.logoutUser);

module.exports = router;