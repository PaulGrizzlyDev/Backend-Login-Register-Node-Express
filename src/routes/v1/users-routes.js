const express = require('express');
const { isAuth} = require('../../middlewares/auth');

const usersController = require('../../controller/user-controller');

const router = express.Router();

router.post('/create', usersController.createUser);
router.post('/update', isAuth, usersController.updateUser);
router.post('/login',usersController.login);
module.exports = router;