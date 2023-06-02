const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {
    renderMyProfile, 
    renderMyAssignment,
} = require('../controllers/userPage')

const router = express.Router();

router.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

// GET /my/profile (마이페이지)
router.get('/profile', isLoggedIn, renderMyProfile);

// GET /my/assignment (내 과제함)
router.get('/assignment', isLoggedIn, renderMyAssignment);

module.exports = router;