const express = require('express');

const ctrl = require('../../controllers/auth');

const { validateBody, authenticate, upload } = require('../../middlewares');

const { authSchemas } = require('../../schemas');

const router = express.Router();

// signup
router.post('/register', validateBody(authSchemas.registerSchema), ctrl.register);

// signin
router.post('/login', validateBody(authSchemas.loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.getCurrent);

router.post('/logout', authenticate, ctrl.logout);
router.patch('/avatars', authenticate, upload.single("avatarURL"), ctrl.updateAvatar);

module.exports = router;
