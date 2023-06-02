const { User } = require('../models');

exports.modify = async (req, res, next) => {
	const newNick = req.body.newNick;
	//console.log(`입력 받은 새로운 닉네임: ${newNick}`);
	try {
		//세션//const user = await User.findOne({ where: { id: req.user.id } });
		const user = await User.findOne({ where: { email: req.user.email } });
		if (user) {
			//세션//await User.update({ userNick: newNick }, { where: { id: req.user.id } });
			await User.update({ userNick: newNick }, { where: { email: req.user.email } });
		} else {
			res.status(404).send('no user');
		}

		return res.redirect('myProfile');
	} catch (error) {
		console.log(error);
		return next(error);
	}
};