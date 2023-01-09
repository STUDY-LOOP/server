const express = require('express');
// const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { 
    renderMain, 
    renderShowAllGroups, 
    renderCreateGroup, 
    renderStudyMain, 
    renderStudySetting, 
    renderStudyMember,
} = require('../controllers/page')


const router = express.Router();


// GET / (메인 페이지)
router.get('/', renderMain);

// GET /study-groups (스터디 전체 목록 페이지)
router.get('/study-groups', renderShowAllGroups);

// GET /study-group (스터디 그룹 생성 페이지)
router.get('/study-group', renderCreateGroup);

// GET /study-group/:groupId (스터디 홈 페이지)
//router.get('/study-group/:groupId', renderStudyMain);
router.post('/study-group/home', renderStudyMain);

// 미완
// GET /study-group/:groupId/setting (스터디 설정 페이지)
router.get('/study-group/:groupId/setting', renderStudySetting);

// 미완
// GET /study-group/:groupId/member (스터디원 정보 페이지)
router.get('/study-group/:groupId/member', renderStudyMember);


module.exports = router;