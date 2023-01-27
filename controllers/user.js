const User = require('../models/user1');

exports.modify = async (req, res, next) => {
  const newNick = req.body.newNick;
  //console.log(`입력 받은 새로운 닉네임: ${newNick}`);
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await User.update({ userNick: newNick }, { where: { id: req.user.id } });
    } else {
      res.status(404).send('no user');
    }

    return res.redirect('myPage');
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
