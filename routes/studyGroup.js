const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { 
    create, modify, remove,
	join, quit,
    submitAssignment, getAssignment, deleteAssignment,
} = require('../controllers/studyGroup');


/* multer setting */
try {
	fs.readdirSync('uploads');
} catch (error) {
	console.error('uploads 폴더 생성');
	fs.mkdirSync('uploads');
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
	limits: { fileSize: 4 * 1024 * 1024 },
});



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

// POST /group/assignment (과제 제출)
router.post('/assignment', upload.single('fileData'), submitAssignment);

// GET /group/download/:filename (과제 다운로드)
router.get('/download/:filename', getAssignment);

// DELETE /group/assignment (과제 삭제))
router.delete('/assignment', deleteAssignment);

module.exports = router;