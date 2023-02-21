const { User, StudyGroup, StudyRule, StudySchedule, AssignmentBox, Assignment, StudyLog } = require('../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.userInfo = async (req, res, next) => {
	const user = req.session.passport.user;
	console.log("HIHI : ", user);
	try {
		if(!user) {
			res.status(400).send({ data: null, message: 'not authorized' });
		}else{
			const userinfo = await user.findOne({ where: { email: user }});
			//res.status(200).json({ data: userinfo, message: 'ok' });
			res.status(200).json(userinfo);
		}
	} catch (error) {
		console.error(error);
		return next(error);
	}
}



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

exports.studyInfo = async (req, res, next) => {
	try {
		const groupPublicId = req.params.gpId;

		const group = await StudyGroup.findOne({
			where: { groupPublicId: groupPublicId },
			attributes: ['groupPublicId', 'groupName', 'groupLeader'],
			include: [
				{ model: StudyRule, attributes: ['rule'], },
				{ model: StudySchedule, attributes: ['scheduleDay', 'scheduleHour', 'scheduleMinute'], }
			],
		});

		res.json(group);

	} catch (error) {
		console.error(error);
		return next(error);
	}
};

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

exports.studyAssignment = async (req, res, next) => {
	try {
		const groupPublicId = req.params.gpId;
		const group_dev = await StudyGroup.findOne({ where: { groupPublicId } });

		const boxlist = await group_dev.getAssignmentBoxes({
			attributes: ['boxId', 'title'],
			include: [{  
				model: Assignment, 
				attributes: ['uploader', 'filename', 'fileOrigin', 'linkData'],
				include: [{ model: User, attributes: ['userNick'] }],
			}],
		});

		res.json(boxlist);

	} catch (error) {
		console.error(error);
		return next(error);
	}
};
