const express = require('express');
const Event = require('../models/event');

const router = express.Router();

router
    .post('/', async (req, res) => {
        try {
            nickname = req.body.nickname;
            groupid = req.body.groupid;

            const events = await Event.findAll()
            res.render('index', { events });
        } catch (err) {
            console.error(err);
            //next(err);
        }
    })
    .get('/', async (req, res) => {
        try {
            groupid = req.body.groupid;
            nickname = req.session.nickname;

            const events = await Event.findAll()
            res.render('index', { events });

        } catch (err) {
            console.error(err);
            //next(err);
        }
    });


module.exports = router;