const express = require('express');
// const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMain, renderShowAllGroups, }= require('../controllers/page')

const router = express.Router();


// GET / (메인 페이지)
router.get('/', renderMain);

// GET /study-groups (스터디 전체 목록 페이지)
router.get('/study-groups', renderShowAllGroups);

module.exports = router;