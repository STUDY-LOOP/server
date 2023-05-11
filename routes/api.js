const express = require('express');
const passport = require('passport');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const {
  findAll,
  studyInfo,
  studyMemberInfo,
  studyAssignment,
  userInfo,
  userAsLeader,
  userAsMember,
  userAllAssignment,
  userAssignment,
  studyLog,
  editStudyLog,
  getMeetId,
  getAttendance,
} = require('../controllers/api');
const {
  create,
  joinGroup,
  quit,
  update,
  createBox,
  submitAssignment,
  getAssignment,
  deleteAssignment,
  studyOneAssignment,
  checkAttendance,
} = require('../controllers/apiStudyGroup');
const {
  getEvent,
  getMeetInfo,
  createEvent,
} = require('../controllers/apiEvent');
const { join, login, logout } = require('../controllers/apiAuth');
const apiChat = require('../controllers/apiChat');
const apiUser = require('../controllers/apiUser');
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
      cb(null, path.basename(file.originalname, ext) + '-' + Date.now() + ext);
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
router.get('/user/:email/assignment', userAllAssignment);
router.get('/user/:email/assignment/:boxId', userAssignment);

// GET /api/:log (스터디 회의록 조회)
router.get('/log/:log', studyLog);

/* --- API(스터디) --- */

// POST /api/group (스터디 생성)
router.post('/group', create);

// Patch /api/:gpId/info (스터디 정보 수정)
router.post('/:gpId/info', update);

// POST /api/group/member (스터디 가입)
router.post('/group/member', joinGroup);

// DELETE /api/member (스터디 탈퇴)
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

// GET /api/event/:log (특정 회의 정보 가져오기)
router.get('/event/:log', getMeetInfo);

// POST /api/event (이벤트 생성)
router.post('/event', createEvent);

/* --- API(채팅) --- */

// POST /api/:gpid/chat (채팅 저장하기)
router.post('/:gpId/chat', apiChat.saveChat);

// POST /api/:gpid/notice (공지 저장하기)
router.post('/:gpId/notice', apiChat.saveNotice);

// GET /api/:gpid/chat (채팅 불러오기)
router.get('/:gpId/chat', apiChat.loadChat);

// GET /api/:gpid/notice (공지 불러오기)
router.get('/:gpId/notice', apiChat.loadNotice);

/* --- API(출석) --- */

// GET /api/:gpId/meet (특정 회의 조회)
router.get('/:gpId/meet', getMeetId);

// GET /api/attendance/:log (특정 회의 출석 조회)
router.get('/attendance/:log', getAttendance);

// POST /api/:gpId/check-attendance/:meetId (출석 체크))
router.post('/:gpId/check-attendance/:meetId', checkAttendance);

/* -- API(마이페이지) -- */

// POST /api/user/:email/modify (개인정보 수정)
router.post('/user/:email/modify', apiUser.modifyUser);

/* -- API(스터디로그) -- */

// POST /api/:log (회의록 수정)
router.post('/log/:log/modify', editStudyLog);

module.exports = router;
