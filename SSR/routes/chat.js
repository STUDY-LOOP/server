const express = require('express');
const { saveChat, joinChatRoom } = require('../controllers/apiChat');
const { isLoggedIn, isMemberOfGroup } = require('../middlewares');
const router = express.Router();

// POST /chat/:groupPublicId/msg
router.post('/:groupPublicId/msg', saveChat);

module.exports = router;
