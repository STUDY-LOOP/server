const { sequelize, User, StudyGroup, StudyRule, StudySchedule } = require('../models');


exports.renderMain = (req, res) => {
	res.render('main');
};


exports.renderShowAllGroups = async (req, res, next) => {
	try{
		const result = await StudyGroup.findAll({ attributes:['groupName', 'groupId'] });
		let gpId = JSON.parse(JSON.stringify(result));	// 깊은복사

		for (let i=0; i<gpId.length; i++){
			gpId[i].groupId = gpId[i].groupId.substr(0, 7);
		}

		return res.render('showAllGroups', {
			title: '스터디 목록',
			groupPublicId: gpId,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
};