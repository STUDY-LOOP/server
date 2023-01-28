const express = require('express');
const { modify } = require('../controllers/user');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

const router = express.Router();

router.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

// PUT /user/profile (회원정보 수정)
router.put('/profile', isLoggedIn, modify);

module.exports = router;
