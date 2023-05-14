const { User, StudyGroup, Event, StudyLog, AssignmentBox, Assignment, Attendance } = require('../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.createEvent = async (req, res, next) => {
	try {
		console.log(req.body);
		const { gpId, event_title, event_type, date_start, date_end, event_des, event_color, boxId } = req.body;
		const group = await StudyGroup.findOne({ where: { groupPublicId: gpId } });

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

		// 일정이 스터디인 경우 -> 스터디 로그 생성
		if (event_type === '0') {
			// console.log('log: ', event.id);
			await StudyLog.create({
				groupId: group.groupId,
				log: event.id,
			});
			// return event.id
		}

		// 일정이 스터디인 경우 -> 출석부 미입력 행 생성
		if (event_type === '0') {
			console.log('att part');
			const members = await group.getUsers({ attributes: ['email'] });

			const leader = await StudyGroup.findOne({
				attributes: ['groupLeader'],
				where: { groupPublicId: gpId }
			})

			console.log('members: ', members);
			// members에 leader 추가
			members.push(leader);

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


exports.EventCalc = async (req, res, next) => {
	try {
		const gpId = req.params.gpId;
		const group = await StudyGroup.findOne({ where: { groupPublicId: gpId } });

		const events = await Event.findAll({
			where: {
				groupId: group.groupId,
				[Op.or]: [{
					event_type: '0'
				}, {
					event_type: '1'
				}],
			},
			include: [{  
				model: AssignmentBox,
				include: [{ model: Assignment }],
			},{
				// 진서지수진서지수진서지수
				model: Attendance,
			}], 
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