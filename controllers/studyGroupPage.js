const { User, StudyGroup, StudyRule, StudySchedule, AssignmentBox, Assignment, StudyLog } = require('../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


exports.renderCreateGroup = (req, res, next) => {
	res.render('createGroup', { title: '스터디 만들기' });
};


exports.renderStudyMain = async (req, res, next) => {
	try {
		const groupPublicId = req.params.groupPublicId;
		const values = groupPublicId.split('=');

		const group_dev = await StudyGroup.findOne({ 
			where: {
				groupName: values[0],
				groupId: { [Op.like]: values[1] + "%" },
			}
		});

		const group = await StudyGroup.findOne({
			where: { groupId: group_dev.groupId },
			attributes: ['groupId', 'groupName', 'groupLeader'],
			include: [
				{ model: StudyRule, attributes: ['rule'], },
				{ model: StudySchedule, attributes: ['scheduleDay', 'scheduleHour', 'scheduleMinute'], }
			],
		});

		const members = await group_dev.getUsers({ attributes: ['userNick'] });

		return res.render('studyMain', {
			title: '스터디 홈',
			groupPublicId,
			group, members,
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
};


exports.renderStudySetting = async (req, res, next) => {
	try {
		const groupPublicId = req.params.groupPublicId;
		const values = groupPublicId.split('=');

		const group_dev = await StudyGroup.findOne({ 
			where: {
				groupName: values[0],
				groupId: { [Op.like]: values[1] + "%" },
			}
		});
		///////////////////// 심플하게 수정 필요
		const group = await StudyGroup.findOne({ 
			where: { groupId: group_dev.groupId },
			attributes: ['groupName', 'groupLeader'],
		});
		const rules = await StudyRule.findOne({
			where: { groupId: group_dev.groupId },
			attributes: ['rule'],
		});
		const schedules = await StudySchedule.findAll({
			where: { groupId: group_dev.groupId },
			attributes: ['scheduleDay', 'scheduleHour', 'scheduleMinute'],
		});
		///////////////////// 심플하게 수정 필요

		return res.render('studySetting', {
			title: '스터디 설정',
			group, rules, schedules, 
			groupPublicId,
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
};


exports.renderStudyMember = async (req, res, next) => {
	try {
		const groupPublicId = req.params.groupPublicId;
		const values = groupPublicId.split('=');

		const group_dev = await StudyGroup.findOne({ 
			where: {
				groupName: values[0],
				groupId: { [Op.like]: values[1] + "%" },
			},
		}); 

		const group = await StudyGroup.findOne({ 
			where: { groupId: group_dev.groupId },
			attributes: ['groupName', 'groupLeader'],
			include: [{
				model: User, 
				attributes: ['email', 'userNick'],
			}]
		});

		const members = await group_dev.getUsers({
			attributes: ['userNick', 'email'],
		});

		const boxlist = await group_dev.getAssignmentBoxes({
			attributes: ['boxId', 'title'],
			include: [{  
				model: Assignment, 
				attributes: ['uploader'],
				include: [{ model: User, attributes: ['userNick'] }],
			}],
		});

		return res.render('studyMember', {
			title: '스터디원 정보',
			group,
			members,
			boxlist,
			groupPublicId,
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
};


exports.renderVideoChat = async (req, res, next) => {
	const groupPublicId = req.params.groupPublicId;
	const nickname = res.locals.user.nickname;

	try {
		const group = await StudyGroup.findOne({
			where: { groupId: groupPublicId }
		});

		return res.render('videoChat', {
			title: '스터디원 정보',
			group,
			groupPublicId,
			//nickname: 세션에서 값 받아오기
			//req.session.passport.user -> 세션에 저장된 email
			nickname: nickname,
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
};


exports.renderAssignment = async (req, res, next) => {
	const groupId = req.params.groupId;
	try {
		const groupPublicId = req.params.groupPublicId;
		const values = groupPublicId.split('=');

		const group_dev = await StudyGroup.findOne({ 
			where: {
				groupName: values[0],
				groupId: { [Op.like]: values[1] + "%" },
			},
			attributes: ['groupId'],
		})

		// 그룹 정보
		const group = await StudyGroup.findOne({ 
			where: { groupId: group_dev.groupId },
			attributes: ['groupName'],
		});

		// 제출한 과제 파일
		const boxlist = await AssignmentBox.findAll({
			where: { groupId: group_dev.groupId },
			attributes: ['boxId', 'title', 'content', 'deadline'],
			include: [{ 
				model: Assignment, 
				attributes: ['uploader', 'filename', 'fileOrigin', 'linkData'] ,
				include: [{ model: User, attributes: ['userNick'] }],
			}],			
		});

		return res.render('studyAssignment', {
			title: '과제함',
			group,
			boxlist,
			groupPublicId,
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
};