const { User, StudyGroup, StudyRule, StudySchedule, AssignmentBox, Assignment, StudyLog } = require('../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// 스터디 전체 목록 조회
exports.findAll = async (req, res, next) => {
	try {
		const studies = await StudyGroup.findAll({ 
			attributes: ['groupPublicId', 'groupName', 'groupLeader'],
		});

		res.json(studies);

	} catch (error) {
		console.error(error);
		return next(error);
	}
}

// 특정 스터디 정보 조회
exports.studyInfo = async (req, res, next) => {
	try {
		const groupPublicId = req.params.gpId;

		const group = await StudyGroup.findOne({
			where: { groupPublicId: groupPublicId },
			attributes: ['groupPublicId', 'groupName', 'groupLeader'],
			include: [
				{ model: StudyRule, attributes: ['rule'] },
				{ model: StudySchedule, attributes: ['scheduleDay', 'scheduleHour', 'scheduleMinute'] },
				{ model: User, attributes: ['userNick'] }
			],
		});

		res.json(group);

	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 특정 스터디 멤버 조회
exports.studyMemberInfo = async (req, res, next) => {
	try {
		const groupPublicId = req.params.gpId;

		const group = await StudyGroup.findOne({ where: { groupPublicId: groupPublicId } });
		const members = await group.getUsers({ attributes: ['userNick', 'email'] });

		res.json(members);

	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 특정 스터디 과제 조회
exports.studyAssignment = async (req, res, next) => {
	try {
		const groupPublicId = req.params.gpId;
		const group_dev = await StudyGroup.findOne({ where: { groupPublicId } });

		const boxlist = await group_dev.getAssignmentBoxes({
			attributes: ['boxId', 'title', 'log', 'deadline', 'content'],
			include: [{  
				model: Assignment, 
				attributes: ['uploader', 'filename', 'fileOrigin', 'linkData'],
				include: [{ model: User, attributes: ['userNick'] }],
			}],
			order: [ ['log', 'ASC'], ['deadline', 'ASC'] ]
		});

		res.json(boxlist);

	} catch (error) {
		console.error(error);
		return next(error);
	}
};



/* --- 마이페이지 --- */

// 특정 사용자 정보 조회 (이메일, 닉네임)
exports.userInfo = async (req, res, next) => {
	try{
		const myId = req.params.email;
		const myProfile = await User.findOne({ 
			where: { email: myId },
			attributes: ['email', 'userNick'],
		});
		return res.json(myProfile);
	}catch(error){
		console.error(error);
		return next(error);
	};
};

// 특정 사용자 정보 조회 (내가 만든 스터디)
exports.userAsLeader = async (req, res, next) => {
	try{
		const myId = req.params.email;
		const asLeader = await StudyGroup.findAll({ where: { groupLeader: myId } });
		return res.json(asLeader);
	}catch(error){
		console.error(error);
		return next(error);
	};
};

// 특정 사용자 정보 조회 (내가 가입한 스터디)
exports.userAsMember = async (req, res, next) => {
	try{
		const myId = req.params.email;
		const asMember = await User.findOne({
			attributes: ['email'],
			where: { email: myId },
			include: [{
				model: StudyGroup,
				attributes: ['groupPublicId', 'groupName'],
				through: { attributes: [] },
				required: false,
			}]	
		});

		return res.json(asMember);
	}catch(error){
		console.error(error);
		return next(error);
	};
};