const express = require('express');
const { studyInfo, studyMemberInfo } = require('../controllers/api');

const router = express.Router();

/* --- API --- */
router.get('/api/:gpId/info', studyInfo);
router.get('/api/:gpId/member', studyMemberInfo);

module.exports = router;