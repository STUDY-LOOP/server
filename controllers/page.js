exports.renderMyPage = (req, res) => {
  res.render('myPage', { title: '마이페이지 - Team12' });
};

exports.renderJoin = (req, res) => {
  res.render('join', { title: '회원가입 - Team12' });
};

exports.renderMain = (req, res, next) => {
  res.render('mainAfter', { title: '메인페이지 - Team12 ' });
};
