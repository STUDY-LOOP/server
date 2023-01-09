const express = require('express');
// const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { 
    create, 
    join, 
    quit,
    modify,
    remove,
} = require('../controllers/studyGroup');

const router = express.Router();

// POST /group (스터디 생성)
router.post('/', create);

// POST /group/member (스터디 가입)
router.post('/member', join);

// DELETE /group/member (스터디 탈퇴)
router.delete('/member', quit)

// PUT /group/:groupId/setting (특정 스터디 설정 변경)
router.put('/:groupId/setting', modify);

// DELETE /group/:groupId/setting (특정 스터디 삭제)
router.delete('/:groupId/setting', remove);

module.exports = router;