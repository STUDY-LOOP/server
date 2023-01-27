const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMyPage, renderJoin, renderMain } = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.participatingCount = 0;
  res.locals.participatingList = [];
  next();
});

router.get('/myPage', isLoggedIn, renderMyPage);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/', renderMain);

module.exports = router;
