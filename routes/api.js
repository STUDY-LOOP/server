const express = require('express');
const passport = require('passport');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { findAll, studyInfo, studyMemberInfo, studyAssignment, userInfo, userAsLeader, userAsMember } = require('../controllers/api');
const { create, joinGroup, quit, createBox, submitAssignment, getAssignment, deleteAssignment, studyOneAssignment } = require('../controllers/apiStudyGroup');
const { getEvent, createEvent } = require('../controllers/apiEvent');
const { join, login, logout } = require('../controllers/apiAuth');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');



/* --- multer setting --- */
try {
	fs.readdirSync('public/uploads');
} catch (error) {
	console.error('uploads 폴더 생성');
	fs.mkdirSync('public/uploads');
}

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, 'public/uploads/');
		},
		filename(req, file, cb) {
			const ext = path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext);
		},
	}),
	limits: { fileSize: 10 * 1024 * 1024 },
});


const router = express.Router();

router.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

/* --- API(로그인) --- */

// POST /api/user (회원가입)
router.post('/user', join);

// POST /api/user/login (로그인)
router.post('/user/login', login);

// GET /api/logout (로그아웃)
router.get('/user/logout', logout);



/* --- API(get) --- */

// GET /api/study/all (스터디 목록 조회)
router.get('/study/all', findAll);

// GET /api/:gpId/info (스터디 정보 조회)
router.get('/:gpId/info', studyInfo);

// GET /api/:gpId/member (특정 스터디원 정보 조회)
router.get('/:gpId/member', studyMemberInfo);

// GET /api/:gpId/assignment (특정 스터디 전체 과제 조회)
router.get('/:gpId/assignment', studyAssignment);

// GET /api/:gpId/:boxId (특정 스터디 특정 과제 조회)
router.get('/:boxId', studyOneAssignment);

// GET /api/:gpId/:boxId (특정 사용자 정보 조회)
router.get('/user/:email/info', userInfo);
router.get('/user/:email/leader', userAsLeader);
router.get('/user/:email/member', userAsMember);

/* --- API(스터디) --- */

// POST /api/group (스터디 생성)
router.post('/group', create);

// POST /api/group/member (스터디 가입)
router.post('/group/member', joinGroup);

// POST /api/member (스터디 탈퇴)
router.delete('/member', quit);



/* --- API(과제) --- */

// GET /api/download/:filename (과제 다운로드)
router.get('/download/:filename', getAssignment);

// DELETE /api/assignment (과제 삭제)
router.delete('/assignment', deleteAssignment);

// POST /api/assignment (과제 제출)
router.post('/assignment', upload.single('fileData'), submitAssignment);

// POST /api/assignmentBox (과제함 생성)
router.post('/assignmentBox', createBox);



/* --- API(캘린더) --- */

// GET /api/:gpid/event (이벤트 정보 가져오기)
router.get('/:gpId/event', getEvent);

// POST /api/event (이벤트 생성)
router.post('/event', createEvent);


module.exports = router;