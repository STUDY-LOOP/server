const { sequelize, User, StudyGroup, StudyRule, StudySchedule } = require('../models');


exports.renderMain = (req, res) => {
	res.render('main');
};


exports.renderShowAllGroups = async (req, res, next) => {
	try{
		const result = await StudyGroup.findAll({
			//attributes:['groupName']
		});
		return res.render('showAllGroups', {
			title: '스터디 목록',
			groups: result,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
};