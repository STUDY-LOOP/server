const express = require('express');
const Event = require('../models/event');

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      const events = await Event.findAll()
      res.json(events);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

  .post(async (req, res, next) => {
    try {
      const event = await Event.create({
        event_title: req.body.title,
        event_type: req.body.type,
        date_star: req.start,
        date_end: req.body.end,
        event_des: req.body.description,
      });
      console.log(event);
      res.status(201).json(event);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.patch('/:id', async (req, res, next) => {
  try {
    const event = await Event.update({
      event_title: req.body.title,
      event_type: req.body.type,
      date_star: req.body.start,
      date_end: req.body.end,
      event_des: req.body.description,
    },
      { where: { id: req.params.id } });
    console.log(event);
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    Event.destroy({
      where: { id: req.params.id }
    });
    console.log(result);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;