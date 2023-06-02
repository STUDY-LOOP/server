const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models');

exports.modifyUser = async (req, res, next) => {
  const newNick = req.body.newNick;
  const hash = await bcrypt.hash(req.body.newPW, 12);
  const myId = req.params.email;
  try {
    const user = await User.findOne({
      where: { email: myId },
    });
    if (user) {
      await User.update(
        { userNick: newNick, userPW: hash },
        { where: { email: myId } }
      );
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
