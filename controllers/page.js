const { StudyGroup } = require('../models');


exports.renderMain = async (req, res, next) => {
	try {
		const result = await StudyGroup.findAll({ attributes: ['groupName', 'groupId'] });
		let gpId = JSON.parse(JSON.stringify(result));	// 깊은복사

		for (let i = 0; i < gpId.length; i++) {
			gpId[i].groupId = gpId[i].groupId.substr(0, 7);
		}

		return res.render('main', {
			title: '메인페이지',
			groupPublicId: gpId,
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

exports.renderJoin = (req, res) => {
	res.render('join', { title: '회원가입' });
};