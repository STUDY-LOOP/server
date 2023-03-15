const { User, StudyGroup, Event } = require('../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.createEvent = async (req, res, next) => {
	try{
        console.log(req.body);
        const { gpId, event_title, event_type, date_start, date_end, event_color } = req.body;
		const group = await StudyGroup.findOne({ where: { groupPublicId: gpId } });

        await Event.create({
			groupId: group.groupId,
			event_title: event_title,
			event_type: event_type,
			date_start: date_start,
			date_end: date_end,
            event_color: event_color,
		});

	}catch(error){
		console.error(error);
		return next(error);
	}
};

exports.getEvent = async (req, res, next) => {
	try{
		const groupPublicId = req.params.gpId;
		const group = await StudyGroup.findOne({ where: { groupPublicId } });
		const events = await Event.findAll({ 
            where: { groupId: group.groupId },
            attributes: [
                // ['id', 'allDay'],
                ['event_title', 'title'], 
                ['date_start', 'start'],
                ['date_end', 'end'],
                ['event_color', 'color'],
                'event_type'
            ]
         });

		return res.json(events);
	}catch(error){
		console.error(error);
		return next(error);
	}
};
