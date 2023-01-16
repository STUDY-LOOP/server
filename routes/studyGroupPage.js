const express = require('express');
// const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { 
    renderCreateGroup,
    renderStudyMain, 
    renderStudySetting, 
    renderStudyMember,
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


module.exports = router;