const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.join = async (req, res, next) => {
	const { email, userNick, userPW } = req.body;
	try {
		const exUser = await User.findOne({ where: { email } });
		if (exUser) {
			return res.send({ code: 1 });
		}
		else{
			const hash = await bcrypt.hash(userPW, 12);
			await User.create({
				email,
				userNick,
				userPW: hash,
			});
			return res.status(200).send({ code: 0 });
		}
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

exports.login = (req, res, next) => {
	passport.authenticate('local', (authError, user, info) => {
		if (authError) {
			// 서버쪽 에러 난 경우
			console.error("에러: ", authError);
			return next(authError);
		}
		if (!user) {
			// 로그인 실패한 경우
			return res.status(400).send({ data: null, code: 1, message: `${info.message}` });
		}
		return req.login(user, async (loginError) => {
			if (loginError) {
				console.error("에러: ", loginError);
				return next(loginError);
			}
			console.log("로그인 성공!");
			const userData = await User.findOne({ where: { id: user.id } });
			return res.status(200).send({
				code: 0,
				message: "request success",
				user_email: userData.email,
				user_nick: userData.userNick,
			});
		});
	})(req, res, next); // 미들웨어 내 미들웨어
};

exports.logout = (req, res) => {
	req.logout(() => {
		return res.send({message: "request success"})
	});
};
