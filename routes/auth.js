const express = require('express');

const router = express.Router();

// getting controller for test cases
const authController = require('../controllers/auth');

const isAuth = require('../middleware/is-auth');
const hasAccess = require('../middleware/has-access');

// Log in Page
router.get('/login',authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/user/new',isAuth,hasAccess, authController.getUser);

router.post('/user',isAuth,hasAccess, authController.postUser);

router.get('/user/:emaiID/edit',isAuth, authController.getChangePass);

router.post('/user/:emaiID',isAuth, authController.postChangePass);

router.get('*',authController.defaultLanding);

module.exports = router;




