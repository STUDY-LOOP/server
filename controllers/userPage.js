const { sequelize, User, StudyGroup, StudyRule, StudySchedule } = require('../models');


exports.renderMyProfile = async (req, res, next) => {
	try{
		// const myId = req.params.myId;
		const myId = req.body.myId;

		const myProfile = await User.findOne({
			where: { email: myId },
		});
		const asLeader = await StudyGroup.findAll({
			where: { groupLeader: myId },
			attributes: ['groupId', 'groupName'],
		});
		const asMember = await User.findOne({
			attributes: ['email'],
			where: { email: myId },
			include: [
				{
					model: StudyGroup,
					attributes: ['groupId', 'groupName'],
					through: { attributes: [] },
					required: false,
				}
			]	
		});

		return res.render('myProfile', {
			title: '마이페이지',
			myProfile, asLeader, asMember,
		});
	}catch(error){
		console.error(error);
		return next(error);
	};
};


// 미완
exports.renderMyAssignment = (req, res, next) => {
	res.render('myAssignment');
};