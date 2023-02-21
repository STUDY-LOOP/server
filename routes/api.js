const express = require('express');
const passport = require('passport');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { findAll, studyInfo, studyMemberInfo, studyAssignment, userInfo } = require('../controllers/api');
const { create, quit, createBox, submitAssignment, getAssignment, deleteAssignment } = require('../controllers/apiStudyGroup');
const { join, login, logout } = require('../controllers/apiAuth');
//const { isLoggedIn, isNotLoggedIn } = require('../middlewares');



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

// POST /api/join (회원가입)
// router.post('/join', isNotLoggedIn, join);
router.post('/join', join);

// POST /api/login (로그인)
// router.post('/login', isNotLoggedIn, login);
router.post('/login', login);

// GET /api/logout (로그아웃)
// router.get('/logout', isLoggedIn, logout);
router.get('/logout', logout);



/* --- API(get) --- */
router.get('/study/all', findAll);
router.get('/:gpId/info', studyInfo);
router.get('/:gpId/member', studyMemberInfo);
router.get('/:gpId/assignment', studyAssignment);

router.get('/user/info', userInfo);

/* --- API(post, delete) --- */
router.post('/group', create);
router.delete('/member', quit);


// GET /api/download/:filename (과제 다운로드)
router.get('/download/:filename', getAssignment);

// DELETE /api/assignment (과제 삭제)
router.delete('/assignment', deleteAssignment);

// POST /api/assignment (과제 제출)
router.post('/assignment', upload.single('fileData'), submitAssignment);

// POST /api/assignmentBox (과제함 생성)
router.post('/assignment', createBox);

module.exports = router;