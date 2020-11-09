const express = require('express');

const usersController = require('../../mongo/controller/user-controller');

const router = express.Router();

router.post('/create', usersController.createUser);

module.exports = router;