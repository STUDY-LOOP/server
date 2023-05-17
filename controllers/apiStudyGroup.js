const {
	sequelize,
	StudyGroup,
	StudyRule,
	StudySchedule,
	StudyType,
	StudyLog,
	User,
	AssignmentBox,
	Assignment,
	Event,
	Attendance,
} = require('../models');
const func = require('../module/functions');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* --- 스터디 기본 --- */

// 스터디 생성
exports.create = async (req, res, next) => {
	const {
		groupName, groupDescription, rule,
		lateTime, lateFee, absentTime, absentFee,
		scheduleDay, scheduleTime,
		interest0, interest1, interest2, interest3, interest4, interest5,
	} = req.body;
	const groupId = uuidv4();
	const groupLeader = req.session.passport.user;

	try {
		const groupPublicId = func.toPublicId(groupName, groupId);
		await StudyGroup.create({
			groupId,
			groupPublicId,
			groupName,
			groupLeader,
			groupDescription,
		});
		await StudySchedule.create({
			groupId,
			scheduleDay,
			scheduleTime,
		});
		await StudyRule.create({
			groupId,
			rule,
			lateTime,
			lateFee,
			absentTime,
			absentFee,
		});
		await StudyType.create({
			groupId,
			interest0,
			interest1,
			interest2,
			interest3,
			interest4,
			interest5,
		})
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 스터디 정보 수정
exports.update = async (req, res, next) => {
	const groupPublicId = req.params.gpId;

	const group = await StudyGroup.findOne({
		where: { groupPublicId: groupPublicId },
		attributes: ['groupId']
	});

	const groupId = group.groupId;
	const updatedValue = req.body;

	const key = Object.keys(updatedValue);

	Object.keys(updatedValue).forEach(async (key) => {
		switch (key) {
			case 'groupDescription':
				await StudyGroup.update({
					groupDescription: updatedValue[key],
				}, {
					where: { groupId: groupId }
				});
				break;
			case 'scheduleDay':
				await StudySchedule.update({
					scheduleDay: updatedValue[key]
				}, {
					where: { groupId: groupId }
				});
				break;
			case 'scheduleTime':
				await StudySchedule.update({
					scheduleTime: updatedValue[key]
				}, {
					where: { groupId: groupId }
				});
				break;
			case 'rule':
				await StudyRule.update({
					rule: updatedValue[key]
				}, {
					where: { groupId: groupId }
				});
				break;
			case 'lateTime':
				await StudyRule.update({
					lateTime: updatedValue[key]
				}, {
					where: { groupId: groupId }
				});
				break;
			case 'lateFee':
				await StudyRule.update({
					lateFee: updatedValue[key]
				}, {
					where: { groupId: groupId }
				});
				break;
			case 'absentTime':
				await StudyRule.update({
					absentTime: updatedValue[key]
				}, {
					where: { groupId: groupId }
				});
				break;
			case 'absentFee':
				await StudyRule.update({
					absentFee: updatedValue[key]
				}, {
					where: { groupId: groupId }
				});
				break;
		}
	});

};

// 스터디 가입
exports.joinGroup = async (req, res, next) => {
	try {
		const { gpId } = req.body;

		const group = await StudyGroup.findOne({ where: { groupPublicId: gpId } });
		const user = await User.findOne({
			where: { email: req.session.passport.user },
		});
		await group.addUser(user);

		return res.status(200).send({ code: 0, message: 'request success' });
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 스터디 탈퇴
exports.quit = async (req, res, next) => {
	try {
		const { memberEmail, gpId } = req.body;

		const user = await User.findOne({
			where: { email: memberEmail },
			attributes: ['id'],
		});
		const group = await StudyGroup.findOne({
			where: { groupPublicId: gpId },
		});

		await sequelize.models.StudyMember.destroy({
			where: {
				StudyGroupGroupId: group.groupId,
				UserId: user.id,
				// 나중에 '나만 탈퇴하기 기능' 추가되면 아래 코드로 수정
				//email: string(req.session.passport.user),
			},
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 스터디 설정 변경
exports.modify = async (req, res, next) => {
	const {
		gpId,
		groupName,
		groupLeader,
		rule,
		scheduleDay,
		scheduleHour,
		scheduleMinute,
	} = req.body;

	try {
		const values = gpId.split('=');
		const group = await StudyGroup.findOne({
			where: {
				groupName: values[0],
				groupId: { [Op.like]: values[1] + '%' },
			},
		});
		const groupId = group.groupId;

		///////////////////// 심플하게 수정 필요
		await StudyGroup.update(
			{ groupId, groupName, groupLeader },
			{ where: { groupId: group.groupId } }
		);
		await StudyRule.update(
			{ groupId, rule },
			{ where: { groupId: group.groupId } }
		);
		await StudySchedule.update(
			{ groupId, scheduleDay, scheduleHour, scheduleMinute },
			{ where: { groupId: group.groupId } }
		);
		//////////////// 스케줄 여러개인 경우에 어떡하지?

		const newGPId = func.toPublicId(groupName, groupId);
		return res.redirect(`/study-group/${newGPId}`);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 스터디 삭제
exports.remove = async (req, res, next) => {
	try {
		const groupPublicId = req.body.gpId;
		const values = groupPublicId.split('=');

		await StudyGroup.destroy({
			where: {
				groupName: values[0],
				groupId: { [Op.like]: values[1] + '%' },
			},
		});
		return res.redirect('/');
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

/* --- 과제함 --- */

// 과제함 생성
exports.createBox = async (req, res, next) => {
	try {
		const { gpId, log, title, content, deadline } = req.body;
		const boxId = uuidv4();
		const group = await StudyGroup.findOne({
			where: { groupPublicId: gpId },
		});

		await StudyLog.findOrCreate({ where: { groupId: group.groupId, log: log } });

		await AssignmentBox.create({
			groupId: group.groupId,
			log: parseInt(log),
			boxId,
			title,
			content,
			deadline,
		});

		return res.json(boxId);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 과제함 삭제
exports.deleteBox = async (req, res, next) => {
	try {
		const { boxId, gpId } = req.body;
		await AssignmentBox.destroy({ where: { boxId } });

		return res.redirect(`/study-group/${gpId}/assignment`);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 과제 제출
exports.submitAssignment = async (req, res, next) => {
	try {
		const jsonData = JSON.parse(req.body.jsonData);
		const { gpId, boxId, uploader } = jsonData;
		const filename = `${req.file.filename}`;
		const fileOrigin = `${req.file.originalname}`;

		const time = await AssignmentBox.findOne({
			where: { boxId: boxId },
			attributes: ['deadline']
		});

		const deadline = new Date(time.dataValues.deadline);
		const now = new Date();
		let state;

		if (now <= deadline) state = 0;
		else if (now > deadline) state = 1;

		const eventId = await Event.findOne({
			where: { boxId: boxId },
			attributes: ['id'],
		});

		await Assignment.update({
			filename: filename,
			fileOrigin: fileOrigin,
			submittedOn: now,
			submitState: state,
		}, {
			where: {
				boxId: boxId,
				uploader: uploader,
				eventId: eventId.dataValues.id,
			}
		});

		return true;
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 과제 다운로드
exports.getAssignment = async (req, res, next) => {
	const filename = req.params.filename;
	const filepath = `${__dirname}\\..\\public\\uploads\\${filename}`;
	try {
		const file = await Assignment.findOne({ where: { filename } });
		const fileOrigin = file.fileOrigin;
		res.download(filepath, fileOrigin);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 과제 삭제
exports.deleteAssignment = async (req, res, next) => {
	const { filename, gpId } = req.body;
	const filepath = `${__dirname}\\..\\public\\uploads\\${filename}`;
	try {
		// db에서 관련 데이터 삭제
		await Assignment.destroy({ where: { filename } });
		// 실제 파일 삭제
		fs.unlink(filepath, (err) => {
			if (err) throw err;
		});

		return res.redirect(`/study-group/${gpId}/assignment`);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 과제함 조회
exports.studyOneAssignment = async (req, res, next) => {
	try {
		const boxId = req.params.boxId;
		const box = await AssignmentBox.findOne({
			where: { boxId },
			attributes: ['boxId', 'title', 'log', 'deadline', 'content'],
			include: [
				{
					model: Assignment,
					attributes: [
						'uploader',
						'filename',
						'fileOrigin',
						'linkData',
						'submittedOn',
						'submitState',
					],
					include: [{ model: User, attributes: ['userNick'] }],
					order: [['submittedOn', 'ASC']],
				},
			],
		});
		res.json(box);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

/* --- 출석부 --- */

// 출석 생성
exports.createAttendance = async (req, res, next) => {
	console.log('create api run');
	try {
		const gpId = req.params.gpId;
		const group = await StudyGroup.findOne({ where: { groupPublicId: gpId } });
		const groupId = group.groupId;

		const eventId = req.params.meetId;

		const members = await StudyMember.findAll({
			attributes: ['userId'],
			where: {
				StudyGroupGroupId: groupId
			},
			include: [{
				model: User,
				attributes: ['email']
			}]
		})

		const leader = await StudyGroup.findOne({
			attributes: ['groupLeader'],
			where: {
				groupId: groupId
			}
		})

	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 출석 체크
exports.checkAttendance = async (req, res, next) => {
	try {
		const groupPublicId = req.params.gpId;
		const group = await StudyGroup.findOne({ where: { groupPublicId } });
		const groupId = group.groupId;

		const eventId = req.params.meetId;

		const { email, enterDate } = req.body;

		const event = await Event.findOne({
			attributes: ['date_start'],
			where: {
				id: eventId,
			},
		});

		const dateE = new Date(enterDate);
		const dateM = new Date(event.date_start);

		var attendState = -1; // 결석
		const late = (dateE - dateM) / 1000 / 60;

		if (late <= 5) {
			attendState = 0; // 출석
			console.log('출석');
		} else if (late < 16) {
			// 5 < late < 16
			attendState = 1; // 지각
			console.log('지각');
		} else {
			attendState = -1;
		}

		await Attendance.update(
			{
				email: email,
				groupId: groupId,
				eventId: eventId,
				enterDate: enterDate,
				attendState: attendState
			},
			{
				where: {
					email: email,
					eventId: eventId
				}
			}
		)

	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 출석 결과 조회, 벌금 계산
exports.attendanceCalc = async (req, res, next) => {
	try {
		const gpId = req.params.gpId;
		const group = await StudyGroup.findOne({ where: { groupPublicId: gpId } });

		const members = await group.getUsers({ attributes: ['email'] });
		const leader = await StudyGroup.findOne({
			attributes: ['groupLeader'],
			where: { groupPublicId: gpId }
		})
		const leaderObj = await User.findOne({
			where: { email: leader.dataValues.groupLeader },
		})
		members.push(leaderObj);

		let arrItems = new Array();
		const rule = await StudyRule.findOne({ where: { groupId: group.groupId } });

		await Promise.all(members.map(async (member) => {
			const memberId = member.email;
			const memberNick = await User.findOne({ where: { email: memberId } });

			let item = new Object();

			const summary = await Attendance.findAll({ where: { groupId: group.groupId, email: memberId } });
			const studyLateCnt = await Attendance.count({ where: { groupId: group.groupId, email: memberId, attendState: { [Op.eq]: 1 } } });
			const studyAbsentCnt = await Attendance.count({ where: { groupId: group.groupId, email: memberId, attendState: { [Op.eq]: -1 } } });
		

			item.email = memberId;
			item.nick = memberNick.userNick;
			item.summary = summary;
			item.studyLateCnt = studyLateCnt;
			item.studyLateFee = studyLateCnt * rule.lateFee;
			item.studyAbsentCnt = studyAbsentCnt
			item.studyAbsentFee = studyAbsentCnt * rule.absentFee;;
			item.totalFee = studyLateCnt * rule.lateFee + studyAbsentCnt * rule.absentFee;

			arrItems.push(item);
		}));
		return res.json(arrItems);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

// 과제 결과 조회, 벌금 계산
exports.assignmentCalc = async (req, res, next) => {
	try {
		const gpId = req.params.gpId;
		const group = await StudyGroup.findOne({ where: { groupPublicId: gpId } });

		const members = await group.getUsers({ attributes: ['email'] });
		const leader = await StudyGroup.findOne({
			attributes: ['groupLeader'],
			where: { groupPublicId: gpId }
		})
		const leaderObj = await User.findOne({
			where: { email: leader.dataValues.groupLeader },
		})
		members.push(leaderObj);

		let arrItems = new Array();
		const rule = await StudyRule.findOne({ where: { groupId: group.groupId } });

		await Promise.all(members.map(async (member) => {
			const memberId = member.email;
			const memberNick = await User.findOne({ where: { email: memberId } });

			let item = new Object();

			const data = await Assignment.findAll({ 
				where: { uploader: memberId },
				include: [{
					model: AssignmentBox,
					where: { groupId: group.groupId }
				}],
			});


			const asgmtLateCnt = await Assignment.count({
				where: { uploader: memberId, submitState: { [Op.eq]: 1 } },
				include: [{
					model: AssignmentBox,
					where: { groupId: group.groupId }
				}],
			});
			const asgmtAbsentCnt = await Assignment.count({
				where: { uploader: memberId, submitState: { [Op.eq]: -1 } },
				include: [{
					model: AssignmentBox,
					where: { groupId: group.groupId }
				}],
			});			

			item.email = memberId;
			item.nick = memberNick.userNick;
			item.summary = new Array(data);
			item.asgmtLateFee = asgmtLateCnt * rule.lateFee;
			item.asgmtLateCnt = asgmtLateCnt
			item.asgmtAbsentFee = asgmtAbsentCnt * rule.absentFee;
			item.asgmtAbsentCnt = asgmtAbsentCnt
			item.totalFee = asgmtLateCnt * rule.lateFee + asgmtAbsentCnt * rule.absentFee;

			arrItems.push(item);
		}));

		return res.json(arrItems);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};