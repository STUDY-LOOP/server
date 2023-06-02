const { User, StudyGroup, Event, StudyLog, AssignmentBox, Assignment, Attendance } = require('../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { v4: uuidv4 } = require('uuid');

exports.createEvent = async (req, res, next) => {
	try {
		console.log(req.body);
		const { gpId, event_title, event_type, date_start, date_end, event_des, event_color } = req.body;
		const group = await StudyGroup.findOne({ where: { groupPublicId: gpId } });
		let boxId = null;

		if (event_type === '1') {
			boxId = uuidv4();

			// 과제함 생성
			const { title, content, deadline } = req.body;
			await AssignmentBox.create({
				groupId: group.groupId,
				log: null,
				boxId,
				title,
				content,
				deadline,
			});
		}

		// 이벤트 생성
		const event = await Event.create({
			groupId: group.groupId,
			event_title: event_title,
			event_type: event_type,
			date_start: date_start,
			date_end: date_end,
			event_des: event_des,
			event_color: event_color,
			boxId: boxId,
		});


		// 일정이 스터디인 경우
		if (event_type === '0') {
			const content = `
##### 스터디 일자


#### 스터디 주제


#### 오늘의 진행 상황


#### 다음 스터디까지 할 일

`;

			await StudyLog.create({
				groupId: group.groupId,
				log: event.id,
				content: content,
			});

			console.log('att part');
			const members = await group.getUsers({ attributes: ['email'] });

			const leader = await StudyGroup.findOne({
				attributes: ['groupLeader'],
				where: { groupPublicId: gpId }
			})

			const leaderObj = await User.findOne({
				where: { email: leader.dataValues.groupLeader }
			})

			members.push(leaderObj);

			await Promise.all(members.map(async (member) => {
				const now = new Date();
				const memberId = member.email;
				await Attendance.create({
					email: memberId,
					groupId: group.groupId,
					eventId: event.id,
					attendState: 2,
					enterDate: now,
				});
			}));
		}

		// 일정이 과제함인 경우
		else if (event_type === '1') {

			// 과제 row 생성
			const members = await group.getUsers({ attributes: ['email'] });
			const leader = await StudyGroup.findOne({
				attributes: ['groupLeader'],
				where: { groupPublicId: gpId }
			})
			const leaderObj = await User.findOne({
				where: { email: leader.dataValues.groupLeader }
			})
			members.push(leaderObj);	// 멤버 목록에 리더 추가

			await Promise.all(members.map(async (member) => {
				const memberId = member.email;
				await Assignment.create({
					uploader: memberId,
					eventId: event.id,
					attendState: 2,
					boxId: boxId,
					submittedOn: null,
				});
			}));
		}

		return true;
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

exports.getEvent = async (req, res, next) => {
	try {
		const groupPublicId = req.params.gpId;
		const group = await StudyGroup.findOne({ where: { groupPublicId } });
		const events = await Event.findAll({
			where: { groupId: group.groupId },
			attributes: [
				['id', 'allDay'],
				['event_title', 'title'],
				['date_start', 'start'],
				['date_end', 'end'],
				['event_color', 'color'],
				['id', 'log'],
				'event_type',
				'boxId',
				'event_des',
			]
		});

		return res.json(events);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};


exports.getEventTitle = async (req, res, next) => {
	try {
		const groupPublicId = req.params.gpId;
		const group = await StudyGroup.findOne({ where: { groupPublicId } });
		const events = await Event.findAll({
			where: { groupId: group.groupId, event_type: { [Op.eq]: 0 } },
			attributes: ['id', 'event_title', 'date_start']
		});

		return res.json(events);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

exports.getMeetInfo = async (req, res, next) => {
	try {
		const eventId = req.params.log;

		const meetInfo = await Event.findAll({
			raw: true,
			where: { id: eventId },
			attributes: ['date_start']
		});

		return res.json(meetInfo);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};