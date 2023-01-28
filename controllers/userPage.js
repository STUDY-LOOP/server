const { sequelize, User, StudyGroup, StudyRule, StudySchedule, AssignmentBox } = require('../models');
const func = require('../module/functions');

exports.renderMyProfile = async (req, res, next) => {
	try{
		const myId = req.session.passport.user;

		const myProfile = await User.findOne({ 
			where: { email: myId },
			attributes: ['email', 'userNick'],
		});

		// 내가 만든 스터디
		const asLeaderTemp = await StudyGroup.findAll({
			where: { groupLeader: myId },
			attributes: ['groupId', 'groupName'],
		});
		let asLeader = JSON.parse(JSON.stringify(asLeaderTemp));	// 깊은복사
		for (let i=0; i<asLeader.length; i++){
			asLeader[i].groupId = asLeader[i].groupName.substr(0, 7);
		}

		// 내가 가입한 스터디
		const asMemberTemp = await User.findOne({
			attributes: ['email'],
			where: { email: myId },
			include: [{
				model: StudyGroup,
				attributes: ['groupId', 'groupName'],
				through: { attributes: [] },
				required: false,
			}]	
		});
		let asMember = JSON.parse(JSON.stringify(asMemberTemp));	// 깊은복사
		for (let i=0; i<asMember.StudyGroups.length; i++){
			asMember.StudyGroups[i].groupId = asMember.StudyGroups[i].groupId.substr(0, 7);
		}

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
		const myId = req.session.passport.user;
		const myProfile = await User.findOne({ where: { email: myId } });

		const myAssignmentsTemp = await myProfile.getAssignments({
			attributes: ['uploader', 'filename', 'fileOrigin', 'linkData'],
			include: [{  
				model: AssignmentBox, 
				attributes: ['boxId', 'groupId', 'title'],
				include: [{ model: StudyGroup, attributes: ['groupName'] }],
			}],
		});

		let myAssignments = JSON.parse(JSON.stringify(myAssignmentsTemp));	// 깊은복사
		console.log(myAssignments);

		for (let i=0; i<myAssignments.length; i++){
			myAssignments[i].AssignmentBox.groupId = myAssignments[i].AssignmentBox.groupId.substr(0, 7);
		}

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