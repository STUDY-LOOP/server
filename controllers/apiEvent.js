const { User, StudyGroup, Event, StudyLog } = require('../models');
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
			await StudyLog.create({
				groupId: group.groupId,
				log: event.id,
			});
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