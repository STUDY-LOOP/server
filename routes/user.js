const express = require('express');
const { modify } = require('../controllers/user');
const { renderMyPage, renderJoin, renderMain } = require('../controllers/page');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

// PUT /user/profile (회원정보 수정)
router.put('/profile', isLoggedIn, modify);

router.get('/myPage', isLoggedIn, renderMyPage);

module.exports = router;
