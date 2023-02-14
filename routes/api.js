const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { findAll, studyInfo, studyMemberInfo, studyAssignment } = require('../controllers/api');
const { create, quit, getAssignment, deleteAssignment, submitAssignment } = require('../controllers/apiStudyGroup');


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

/* --- API(get) --- */
router.get('/study/all', findAll);
router.get('/:gpId/info', studyInfo);
router.get('/:gpId/member', studyMemberInfo);
router.get('/:gpId/assignment', studyAssignment);

/* --- API(post, delete) --- */
router.post('/group', create);
router.delete('/member', quit);


// GET /api/download/:filename (과제 다운로드)
router.get('/download/:filename', getAssignment);

// DELETE /api/assignment (과제 삭제)
router.delete('/assignment', deleteAssignment);

// POST /api/assignment (과제 제출)
router.post('/assignment', upload.single('file'), submitAssignment);

module.exports = router;