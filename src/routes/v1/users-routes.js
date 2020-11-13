const express = require('express');
const { isAuth } = require('../../middlewares/auth');

const usersController = require('../../controller/user-controller');

const router = express.Router();

router.post('/create', usersController.createUser);
router.post('/update', isAuth, usersController.updateUser);
router.post('/delete', isAuth, usersController.deleteUser);
router.post('/login',usersController.login);
router.post('/lost-password',usersController.lostPassword);

module.exports = router;