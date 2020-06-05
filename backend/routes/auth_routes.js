const express = require('express');
const router = express.Router();

const auth_controller = require('../controllers/auth_Controller');

/* Post Create new Auth */
router.post('/register', auth_controller.register);

/* Post Create new Auth */
router.post('/login', auth_controller.login);

module.exports = router;
