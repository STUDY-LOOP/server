
const { User, StudyGroup, StudyRule, StudySchedule, AssignmentBox, Assignment, StudyLog, Event, Attendance, StudyType } = require('../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// 스터디 전체 목록 조회
exports.findAll = async (req, res, next) => {
	try {
		const studies = await StudyGroup.findAll({ 
			attributes: ['groupPublicId', 'groupName', 'groupLeader', 'groupDescription'],
			// order: Sequelize.random(),
			order: Sequelize.literal('rand()'),
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
			attributes: [
				'groupPublicId', 
				'groupName', 
				'groupLeader', 
				'groupDescription'
			],
			include: [
				{ 
					model: StudyRule, 
					attributes: [
						'rule', 
						'lateTime', 
						'lateFee', 
						'absentTime', 
						'absentFee'
					] 
				},
				{ model: StudySchedule, attributes: ['scheduleDay', 'scheduleTime'] },
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

		const group = await StudyGroup.findOne({
			where: { groupPublicId: groupPublicId } 
		});
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
			include: [
				{
				model: Assignment,
				attributes: [
					'uploader', 
					'filename', 
					'fileOrigin', 
					'linkData', 
					'submittedOn'
				],
				include: [{ model: User, attributes: ['userNick'] }],
			}
		],
			order: [
				['log', 'ASC'], 
				['deadline', 'ASC'], 
				[Assignment, 'id', 'ASC']
			]
		});

		res.json(boxlist);

	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 특정 스터디 출석 조회
exports.studyAttendance = async (req, res, next) => {
	try {
		const groupPublicId = req.params.gpId;
		const group = await StudyGroup.findOne({ where: { groupPublicId } });
		const groupId = group.groupId;

		const attendance = await Attendance.findAll({
			attributes: [
				'email',
				[Sequelize.fn('SUM', Sequelize.literal('CASE WHEN Attendance.attendState = 0 THEN 1 ELSE 0 END')), 'attendCnt'],
				[Sequelize.fn('SUM', Sequelize.literal('CASE WHEN Attendance.attendState = 1 THEN 1 ELSE 0 END')), 'lateCnt'],
				[Sequelize.fn('SUM', Sequelize.literal('CASE WHEN Attendance.attendState = -1 THEN 1 ELSE 0 END')), 'absentCnt'],
			],
			where: { groupId: groupId },
			include: [{
				model: User,
				attributes: ['userNick'],
			}],
			group: ['Attendance.email'],
		})

		res.json(attendance);

	} catch (error) {
		console.error(error);
		return next(error);
	}
};



/* --- 마이페이지 --- */

// 특정 사용자 정보 조회 (이메일, 닉네임)
exports.userInfo = async (req, res, next) => {
	try {
		const myId = req.params.email;
		const myProfile = await User.findOne({
			where: { email: myId },
			attributes: ['email', 'userNick'],
		});
		return res.json(myProfile);
	} catch (error) {
		console.error(error);
		return next(error);
	};
};

// 특정 사용자 정보 조회 (내가 만든 스터디)
exports.userAsLeader = async (req, res, next) => {
	try {
		const myId = req.params.email;
		const asLeader = await StudyGroup.findAll({ where: { groupLeader: myId } });
		return res.json(asLeader);
	} catch (error) {
		console.error(error);
		return next(error);
	};
};

// 특정 사용자 정보 조회 (내가 가입한 스터디)
exports.userAsMember = async (req, res, next) => {
	try {
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
	} catch (error) {
		console.error(error);
		return next(error);
	};
};

// 특정 사용자가 제출한 모든 과제 조회
exports.userAllAssignment = async (req, res, next) => {
	try {
		const myId = req.params.email;
		const allAssignment = await Assignment.findAll({
			where: { uploader: myId }
		});

		return res.json(allAssignment);
	} catch (error) {
		console.error(error);
		return next(error);
	};
};

// 특정 사용자가 제출한 특정 과제함의 과제 조회
exports.userAssignment = async (req, res, next) => {
	try {
		const myId = req.params.email;
		const boxId = req.params.boxId;
		const assignment = await Assignment.findAll({
			where: {
				uploader: myId,
				boxId: boxId,
			},
			include: [{
				model: User,
				attributes: ['userNick'],
				required: false,
			}]
		});

		return res.json(assignment);
	} catch (error) {
		console.error(error);
		return next(error);
	};
};


// 스터디 회의록 조회
exports.studyLog = async (req, res, next) => {
	try {
		const log = req.params.log;
		const content = await StudyLog.findOne({
			attributes: ['content'],
			where: { log }
		});

		return res.json(content);
	} catch (error) {
		console.error(error);
		return next(error);
	};
};

//스터디 회의록 수정
exports.editStudyLog = async (req, res, next) => {
	try {
	  const targetLog = StudyLog.findOne({ where: { log: req.params.log } });
	  if (targetLog) {
		await StudyLog.update(
		  { content: req.body.newContent },
		  { where: { log: req.params.log } }
		);
	  } else {
		res.status(404).send('invalid log');
	  }
	} catch (error) {
	  console.log(error);
	  return next(error);
	}
  };

/* --- 출석부 --- */

// 회의 이벤트 아이디
exports.getMeetId = async (req, res, next) => {
	try {
		const groupPublicId = req.params.gpId;
		const group = await StudyGroup.findOne({
			where: { groupPublicId }
		});

		var today = new Date();
		var tomorrow = new Date();
		tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));

		// dateTimeString 코드 정리
		var year = today.getFullYear();
		var month = ('0' + (today.getMonth() + 1)).slice(-2);
		var day = ('0' + today.getDate()).slice(-2);

		const dateString = year + '-' + month + '-' + day; //YYYY-MM-DD

		const dateStart = dateString + 'T00:00:00.000Z'
		const dateEnd = dateString + 'T23:59:59.000Z'

		const meet = await Event.findOne({
			attributes: ['id', 'date_start'],
			where: {
				groupId: group.groupId, //group id
				event_type: '0', 	// 회의		
				date_start: {
					[Op.between]: [dateStart, dateEnd] // 쿼리 실행 시 +9시간
				}
			},
		});

		return res.json(meet);
	} catch (error) {
		return next(error);
	}
};

// 특정 회의 출석 조회
exports.getAttendance = async (req, res, next) => {
	try {
		const meetId = req.params.log;
		
		// 출석 정보 조회 
		const attendance = await Attendance.findAll({
			attributes: ['email', 'attendState'],
			where: {
				eventId: meetId,
			},
			include: [{
				model: User,
				attributes: ['userNick'],
			}]
		});
		return res.json(attendance);

	} catch (error) {
		console.error(error);
		return next(error);
	}
};

/* 검색 결과 */
exports.searchResult = async (req, res, next) => {
	try {
		const keyword = req.params.keyword;
		const types = ['어학', '취업', '개발', '기타', '취미/교양', '고시/공시'];
		let flag = [false, false, false, false, false, false];

		for (i=0; i<6; i++) {
			flag[i] = types[i].includes(keyword)
			// interest #(flag의 true 인덱스) == true
		}

		// 출석 정보 조회 
		const result = await StudyGroup.findAll({
			where: {
				[Sequelize.Op.or]: [{
					groupName: { [Op.like]: "%" + keyword + "%" },
				}, {
					groupDescription: { [Op.like]: "%" + keyword + "%" },
				}],
			},
		});

		return res.json(result);

	} catch (error) {
		console.error(error);
		return next(error);
	}
};
