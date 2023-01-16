const { sequelize, User, StudyGroup, StudyRule, StudySchedule } = require('../models');


exports.renderCreateGroup = (req, res, next) => {
	res.render('createGroup', { title: '스터디 만들기' });
};


exports.renderStudyMain = async (req, res, next) => {
	try{
		const groupId = req.params.groupId;

		const group = await StudyGroup.findOne({
			where: { groupId: groupId },
			attributes: [ 'groupId', 'groupName', 'groupLeader' ],
			include: [
				{ model: StudyRule, attributes: ['rule'], },
				{ model: StudySchedule, attributes: ['scheduleDay', 'scheduleHour', 'scheduleMinute'], }
			],
		});

		const members = await group.getUsers();

		return res.render('studyMain', {
			title: '스터디 홈',
			group, members,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
};


exports.renderStudySetting = async (req, res, next) => {
	try{
		const group = await StudyGroup.findOne({
			where: { groupId: req.params.groupId } 
		});
		const rules = await StudyRule.findOne({ 
			where: { groupId: req.params.groupId } 
		});
		const schedules = await StudySchedule.findAll({ 
			where: { groupId: req.params.groupId } 
		});

		return res.render('studySetting', {
			title: '스터디 설정',
			group, 
			rules, 
			schedules,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
};


exports.renderStudyMember = async (req, res, next) => {
	const groupId = req.params.groupId;
	try{
		const group = await StudyGroup.findOne({
			where: { groupId: groupId }
		});

		const members = await group.getUsers();

		return res.render('studyMember', {
			title: '스터디원 정보',
			group,
			members,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
};