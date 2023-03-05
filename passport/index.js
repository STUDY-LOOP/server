const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log("세션에 저장: ", user.email);
    done(null, user.email); // 세션에 user의 email만 저장
  });

  passport.deserializeUser(async (email, done) => {
    console.log("실행: deserializeUser");
    try {
      const user = await User.findOne({ where: { email }});
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
