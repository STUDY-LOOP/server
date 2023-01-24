const { sequelize, StudyGroup, StudyRule, StudySchedule, StudyLog, User, AssignmentBox, Assignment } = require('../models');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

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


/* 과제함 */

// 과제함 생성
exports.createBox = async (req, res, next) => {
	try{
		const { groupId, log, title, content, deadline } = req.body;
		const boxId = uuidv4();

		await StudyLog.findOrCreate({
			where: {
				groupId,
				log,
			}
		});

		await AssignmentBox.create({
			groupId, 
			log: parseInt(log),
			boxId, 
			title, 
			content, 
			deadline: null,
		});

		return res.redirect('/study-group/'+groupId+'/assignment');
	}catch(error){
		console.error(error);
		return next(error);
	}
}

// 과제함 삭제
exports.deleteBox = async (req, res, next) => {
	try{
		const { boxId, groupId } = req.body;
		await AssignmentBox.destroy({ where: { boxId } });
		
		return res.redirect('/study-group/'+groupId+'/assignment');
	}catch(error){
		console.error(error);
		return next(error);
	}
}

// 과제 제출
exports.submitAssignment = async (req, res, next) => {
	try{
		const { groupId, boxId, uploader } = req.body;
		const filename = `${req.file.filename}`;
		const fileOrigin = `${req.file.originalname}`;

		await Assignment.create({
			boxId,
			uploader,
			filename,
			fileOrigin,
		});

		return res.redirect('/study-group/'+groupId+'/assignment');
	}catch(error){
		console.error(error);
		return next(error);
	}
}

// 과제 다운로드
exports.getAssignment = async (req, res, next) => {
	const filename = req.params.filename;
	const filepath = `${__dirname}\\..\\public\\uploads\\${filename}`
	try{
		const file = await Assignment.findOne({ where: { filename } });
		const fileOrigin = file.fileOrigin;
		res.download(filepath, fileOrigin);
	}catch(error){
		console.error(error);
		return next(error);
	}
}

// 과제 삭제
exports.deleteAssignment = async (req, res, next) => {
	const { filename, groupId } = req.body;
	const filepath = `${__dirname}\\..\\public\\uploads\\${filename}`
	try{
		// db에서 관련 데이터 삭제
		await Assignment.destroy({ where: { filename } });
		// 실제 파일 삭제
		fs.unlink(filepath, err => { if (err) throw err; });
		
		return res.redirect('/study-group/'+groupId+'/assignment');
	}catch(error){
		console.error(error);
		return next(error);
	}
}