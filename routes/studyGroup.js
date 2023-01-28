const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const { isLoggedIn, isNotLoggedIn, isMemberOfGroup, isLeaderOfGroup } = require('../middlewares');
const { 
    create, modify, remove,
	join, quit,
	createBox, deleteBox,
    submitAssignment, getAssignment, deleteAssignment,
} = require('../controllers/studyGroup');


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



/* --- 스터디그룹 --- */

// POST /group (스터디 생성)
router.post('/', isLoggedIn, create);

// POST /group/member (스터디 가입)
router.post('/member', isLoggedIn, join);

// DELETE /group/member (스터디 탈퇴)
router.delete('/member', isMemberOfGroup, quit)

// PUT /group/:groupPublicId/setting (특정 스터디 설정 변경)
router.put('/:groupPublicId/setting', isLeaderOfGroup, modify);

// DELETE /group/:groupPublicId/setting (특정 스터디 삭제)
router.delete('/:groupPublicId/setting', isLeaderOfGroup, remove);



/* --- 과제 --- */

// POST /group/assignmentBox (과제함 생성)
router.post('/assignmentBox', isLeaderOfGroup, createBox);

// DELETE /group/assignmentBox (과제함 삭제)
router.delete('/assignmentBox', isLeaderOfGroup, deleteBox);

// POST /group/assignment (과제 제출)
router.post('/assignment', isMemberOfGroup, upload.single('fileData'), submitAssignment);

// GET /group/download/:filename (과제 다운로드)
router.get('/download/:filename', isMemberOfGroup, getAssignment);

// DELETE /group/assignment (과제 삭제)
router.delete('/assignment', isMemberOfGroup, deleteAssignment);

module.exports = router;