const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user1');

exports.join = async (req, res, next) => {
  //console.log(`req.body stringify 값: ${JSON.stringify(req.body)}`);
  //const { email, userPW } = req.body;
  const email = req.body.email;
  const userNick = req.body.nickname;
  const userPW = req.body.password;
  //console.log(`상세값: ${(email, userPW)}`);
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(userPW, 12);
    console.log(`비번값: ${hash}`);
    await User.create({
      email,
      userNick,
      userPW: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      // 서버쪽 에러 난 경우
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      // 로그인 실패한 경우
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};
