const func = require('../module/functions');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};

exports.isLeaderOfGroup = async (req, res, next) => {
  const email = res.locals.user.email;
  let gpId = req.params.groupPublicId;
  if(!gpId){ gpId = req.body.gpId; }

  if (await func.isLeaderOf(email, gpId)) {
    next();
  } else {
    res.status(403).send('스터디장이 아닙니다');
  }
};

exports.isMemberOfGroup = async (req, res, next) => {
  const email = res.locals.user.email;
  let gpId = req.params.groupPublicId;
  if(!gpId){ gpId = req.body.gpId; }

  if (await func.isMemberOf(email, gpId)) {
    next();
  } else {
    res.status(403).send('스터디 멤버가 아닙니다');
  }
};