const express = require('express');
// const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {
    renderMyProfile, 
    renderMyAssignment,
} = require('../controllers/userPage')

const router = express.Router();

// GET /my/profile
// 나중에 get으로 수정 (데이터는 세션에서 가져옴)
router.post('/profile', renderMyProfile);

// GET /my/assignment
router.get('/assignment', renderMyAssignment);

module.exports = router;