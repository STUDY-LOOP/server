const { sequelize, StudyGroup, StudyRule, StudySchedule, StudyLog, User, AssignmentBox, Assignment } = require('../models');
const func = require('../module/functions');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


/* --- 스터디 기본 --- */

// 스터디 생성
exports.create = async (req, res, next) => {
	const { groupName, rule, scheduleDay, scheduleHour, scheduleMinute } = req.body;
	const groupId = uuidv4();
	const groupLeader = req.session.passport.user;
	try {
		const groupPublicId = func.toPublicId(groupName, groupId);
		await StudyGroup.create({
			groupId,
			groupPublicId,
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
	} catch(error) {
		console.error(error);
		return next(error);
	}
}

// 스터디 가입
exports.joinGroup = async (req, res, next) => {
	try {
		const { gpId } = req.body;

		const group = await StudyGroup.findOne({ where: { groupPublicId: gpId } });
		const user = await User.findOne({ where: { email: req.session.passport.user } });
		await group.addUser(user);

		return res.status(200).send({ code: 0, message: "request success" });
	} catch(error) {
		console.error(error);
		return next(error);
	}
}

// 스터디 탈퇴
exports.quit = async (req, res, next) => {
	try{
		const { memberEmail, gpId } = req.body;

		const user = await User.findOne({ where: {email: memberEmail}, attributes: ['id'] });
		const group = await StudyGroup.findOne({
			where: { groupPublicId: gpId }
		});

		await sequelize.models.StudyMember.destroy({
			where: { 
				StudyGroupGroupId: group.groupId,
				UserId: user.id,
				// 나중에 '나만 탈퇴하기 기능' 추가되면 아래 코드로 수정
				//email: string(req.session.passport.user),
			}
		});

	}catch(error){
		console.error(error);
		return next(error);
	}
}

// 스터디 설정 변경
exports.modify = async (req, res, next) => {
	const { 
		gpId, groupName, groupLeader, rule,
		scheduleDay, scheduleHour, scheduleMinute,
	} = req.body;

	try {
		const values = gpId.split('=');
		const group = await StudyGroup.findOne({
			where: {
				groupName: values[0],
				groupId: { [Op.like]: values[1] + "%" },
			}
		});
		const groupId = group.groupId;

		///////////////////// 심플하게 수정 필요
		await StudyGroup.update(
			{ groupId, groupName, groupLeader },
			{ where: { groupId: group.groupId} },
		);
		await StudyRule.update(
			{ groupId, rule },
			{ where: { groupId: group.groupId} },
		);
		await StudySchedule.update(
			{ groupId, scheduleDay, scheduleHour, scheduleMinute },
			{ where: { groupId: group.groupId} },
			);
		//////////////// 스케줄 여러개인 경우에 어떡하지?

		const newGPId = func.toPublicId(groupName, groupId);
		return res.redirect(`/study-group/${newGPId}`);
	} catch(error) {
		console.error(error);
		return next(error);
	}
}


// 스터디 삭제
exports.remove = async (req, res, next) => {
	try{
		const groupPublicId = req.body.gpId;
		const values = groupPublicId.split('=');

		await StudyGroup.destroy({ 
			where: { 
				groupName: values[0],
				groupId: { [Op.like]: values[1] + "%" },
			} 
		});
		return res.redirect('/');
	}catch(error){
		console.error(error);
		return next(error);
	}
}


/* --- 과제함 --- */

// 과제함 생성
exports.createBox = async (req, res, next) => {
	try{
		const { gpId, log, title, content, deadline } = req.body;
		const values = gpId.split('=');
		const boxId = uuidv4();

		const group_dev = await StudyGroup.findOne({ 
			where: {
				groupName: values[0],
				groupId: { [Op.like]: values[1] + "%" },
			} 
		});

		await StudyLog.findOrCreate({ where: { groupId: group_dev.groupId, log } });

		await AssignmentBox.create({
			groupId: group_dev.groupId, 
			log: parseInt(log),
			boxId, 
			title, 
			content, 
			deadline: null,
		});

		return res.redirect(`/`);
	}catch(error){
		console.error(error);
		return next(error);
	}
}

// 과제함 삭제
exports.deleteBox = async (req, res, next) => {
	try{
		const { boxId, gpId } = req.body;
		await AssignmentBox.destroy({ where: { boxId } });
		
		return res.redirect(`/study-group/${gpId}/assignment`);
	}catch(error){
		console.error(error);
		return next(error);
	}
}

// 과제 제출
exports.submitAssignment = async (req, res, next) => {
	try{
		const jsonData = JSON.parse(req.body.jsonData);
		const { gpId, boxId, uploader } = jsonData;
		const filename = `${req.file.filename}`;
		const fileOrigin = `${req.file.originalname}`;

		await Assignment.create({
			boxId,
			uploader,
			filename,
			fileOrigin,
		});
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
	const { filename, gpId } = req.body;
	const filepath = `${__dirname}\\..\\public\\uploads\\${filename}`
	try{
		// db에서 관련 데이터 삭제
		await Assignment.destroy({ where: { filename } });
		// 실제 파일 삭제
		fs.unlink(filepath, err => { if (err) throw err; });
		
		return res.redirect(`/study-group/${gpId}/assignment`);
	}catch(error){
		console.error(error);
		return next(error);
	}
}