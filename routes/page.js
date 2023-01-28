const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderJoin, renderMain } = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.participatingCount = 0;
  res.locals.participatingList = [];
  next();
});


// GET / (메인 페이지)
router.get('/', renderMain);

// GET / (회원가입)
router.get('/join', isNotLoggedIn, renderJoin);

module.exports = router;
