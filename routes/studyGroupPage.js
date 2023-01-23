const express = require('express');
// const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { 
    renderCreateGroup,
    renderStudyMain, 
    renderStudySetting, 
    renderStudyMember,
    renderVideoChat,
    renderAssignment,
} = require('../controllers/studyGroupPage');


const router = express.Router();

// GET /study-group (스터디 그룹 생성 페이지)
router.get('/', renderCreateGroup);

// GET /study-group/:groupId (스터디 홈 페이지)
router.get('/:groupId', renderStudyMain);

// GET /study-group/:groupId/setting (스터디 설정 페이지)
router.get('/:groupId/setting', renderStudySetting);

// GET /study-group/:groupId/member (스터디원 정보 페이지)
router.get('/:groupId/member', renderStudyMember);

// POST /study-group/videoChat (화상채팅)
//router.post('/videoChat', renderVideoChat);
// GET /study-group/:groupId/videoChat (화상채팅)
router.get('/:groupId/videoChat', renderVideoChat);

// GET /study-group/:groupId/assignment (과제함)
router.get('/:groupId/assignment', renderAssignment);

module.exports = router;