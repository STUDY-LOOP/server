const { User, StudyGroup, StudyRule, StudySchedule, AssignmentBox, Assignment, StudyLog } = require('../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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
		const members = await group.getUsers({ attributes: ['userNick'] });

		res.json(members);

	} catch (error) {
		console.error(error);
		return next(error);
	}
};
