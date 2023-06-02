const express = require('express');
const { isLoggedIn, isNotLoggedIn, isMemberOfGroup, isLeaderOfGroup  } = require('../middlewares');
const { 
    renderCreateGroup,
    renderStudyMain, 
    renderStudySetting, 
    renderStudyMember,
    renderVideoChat,
    renderAssignment,
} = require('../controllers/studyGroupPage');


const router = express.Router();

router.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

// GET /study-group (스터디 그룹 생성 페이지)
router.get('/', renderCreateGroup);

// GET /study-group/:groupPublicId (스터디 홈 페이지)
router.get('/:groupPublicId', renderStudyMain);

// GET /study-group/:groupPublicId/setting (스터디 설정 페이지)
router.get('/:groupPublicId/setting', isLoggedIn, isLeaderOfGroup, renderStudySetting);

// GET /study-group/:groupPublicId/member (스터디원 정보 페이지)
router.get('/:groupPublicId/member', isLoggedIn, isMemberOfGroup, renderStudyMember);

// GET /study-group/:groupPublicId/videoChat (화상채팅)
router.get('/:groupPublicId/videoChat', isLoggedIn, isMemberOfGroup, renderVideoChat);

// GET /study-group/:groupPublicId/assignment (과제함)
router.get('/:groupPublicId/assignment', isLoggedIn, isMemberOfGroup, renderAssignment);

module.exports = router;