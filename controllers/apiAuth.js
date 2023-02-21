const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

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
		//return res.redirect('/');
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

exports.login = (req, res, next) => {
	passport.authenticate('local', (authError, user, info) => {
		//res.json({ message: 'ok' });

		if (authError) {
			// 서버쪽 에러 난 경우
			console.error("에러1: ", authError);
			return next(authError);
		}
		else if (!user) {
			// 로그인 실패한 경우
			//return res.redirect(`/?loginError=${info.message}`);
			res.status(400).send({ data: null, message: 'not authorized' });
		}
		else {
			req.login(user, (loginError) => {
				if (loginError) {
					console.error("에러2: ", loginError);
					return next(loginError);
				}
				console.log("로그인 성공!");
				return res.redirect('/');
				//res.json({ message: 'ok' });

			}
			);
		}
	})(req, res, next); // 미들웨어 내 미들웨어
};

exports.logout = (req, res) => {
	req.logout(() => {
		res.redirect('/');
	});
};
