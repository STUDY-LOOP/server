const { sequelize, User, StudyGroup, StudyRule, StudySchedule, AssignmentBox } = require('../models');


exports.renderMyProfile = async (req, res, next) => {
	try{
		// const myId = req.params.myId;
		const myId = req.body.myId;
		const myProfile = await User.findOne({ 
			where: { email: myId },
			attributes: ['email', 'userNick'],
		});

		// 내가 만든 스터디
		const asLeader = await StudyGroup.findAll({
			where: { groupLeader: myId },
			attributes: ['groupId', 'groupName'],
		});

		// 내가 가입한 스터디
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



exports.renderMyAssignment = async (req, res, next) => {
	try{
		const myId = req.body.myId;
		const myProfile = await User.findOne({ where: { email: myId } });

		const myAssignments = await myProfile.getAssignments({
			attributes: ['uploader', 'filename', 'fileOrigin', 'linkData'],
			include: [{  
				model: AssignmentBox, 
				attributes: ['boxId', 'groupId', 'title'],
				include: [{ model: StudyGroup, attributes: ['groupId', 'groupName'] }],
			}],
		});

		console.log("안녕하세요")
		//console.log(myAssignments.AssignmentBox.StudyGroup.groupName);

		return res.render('myAssignment', {
			title: '마이페이지 - 과제함',
			myId,
			myAssignments,
		});
	}catch(error){
		console.error(error);
		return next(error);
	};
};