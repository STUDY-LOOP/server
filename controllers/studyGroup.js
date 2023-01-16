const { sequelize, StudyGroup, StudyRule, StudySchedule, User } = require('../models');
const { v4: uuidv4 } = require('uuid');

// 스터디 생성
exports.create = async (req, res, next) => {
	const { groupName, groupLeader, rule, scheduleDay, scheduleHour, scheduleMinute } = req.body;
	groupId = uuidv4();
	try {
		// 사용자 DB 연결 후 수정 필요
		await User.create({
			email: groupLeader,
			nick: groupLeader,
			password: 'password',
		});
		await StudyGroup.create({
			groupId,
			groupName,
			groupLeader,
		});
		await StudySchedule.create({
		    groupId,
		    scheduleDay,
		    scheduleHour, 
		    scheduleMinute,
		});
		await StudyRule.create({
		    groupId,
		    rule,
		});        
		return res.redirect('/study-group/'+groupId);
	} catch(error) {
		//console.log("ERROR!");
		console.error(error);
		return next(error);
	}
}

// 스터디 가입
exports.join = async (req, res, next) => {
	const { userName, groupId } = req.body;
	try {
		const group = await StudyGroup.findOne({ where: { groupId: groupId } });
		const user = await User.create({
			email: userName,
			nick: userName,
			password: 'password',
		});
		await group.addUser(user);
		return res.redirect('/study-group/'+groupId);
	} catch(error) {
		console.error(error);
		return next(error);
	}
}

// 스터디 탈퇴
exports.quit = async (req, res, next) => {
	const { email, groupId } = req.body;
	const userId = await User.findOne({ where: {email}, attributes: ['id'] });
	try{
		await sequelize.models.StudyMember.destroy({
			where: { 
				StudyGroupGroupId: groupId,
				UserId: userId.id,
			}
		});
		return res.redirect('/study-group/'+groupId);
	}catch(error){
		console.error(error);
		return next(error);
	}
}

// 스터디 설정 변경
exports.modify = async (req, res, next) => {
	const { 
		groupId, groupName, groupLeader, rule,
		scheduleDay, scheduleHour, scheduleMinute,
	} = req.body;

	try {
		///////////////////// 심플하게 수정 필요
		await StudyGroup.update(
			{ groupId, groupName, groupLeader },
			{ where: { groupId: groupId} },
		);
		await StudyRule.update(
			{ groupId, rule },
			{ where: { groupId: groupId} },
		);
		await StudySchedule.update(
			{ groupId, scheduleDay, scheduleHour, scheduleMinute },
			{ where: { groupId: groupId} },
		);//////////////// 스케줄 여러개인 경우에 어떡하지?

		return res.redirect('/study-group/'+groupId);
	} catch(error) {
		console.error(error);
		return next(error);
	}
}


// 스터디 삭제
exports.remove = async (req, res, next) => {
	const { groupId } = req.body;
	try{
		await StudyGroup.destroy({ where: { groupId: groupId } });
		return res.redirect('/study-groups');
	}catch(error){
		console.error(error);
		return next(error);
	}
}