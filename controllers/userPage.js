const { sequelize, User, StudyGroup, StudyRule, StudySchedule, AssignmentBox } = require('../models');
const func = require('../module/functions');

exports.renderMyProfile = async (req, res, next) => {
	try{
		// const myId = req.params.myId;
		const myId = req.body.myId;

		////////////////// 나중에 삭제하기
		if (myId === ''){
			return res.render('myProfile');
		};

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


// 작업 필요
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