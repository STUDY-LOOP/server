const express = require('express');
const Event = require('../models/event');

const router = express.Router();

router
    .get('/', async (req, res, next) => {

        try {
            // let nickname = req.body.nickname;
            // let groupid = req.body.groupid;

            // req.session.nickname = nickname;
            // req.session.groupid = groupid;
            // res.render('index');

        } catch (err) {
            console.error(err);
            next(err);
        }
    })

    .post('/', async (req, res) => {

        try {
            let nickname = req.body.nickname;
            let groupid = req.body.groupid;

            req.session.nickname = nickname;
            req.session.groupid = groupid;
            res.render('index');

        } catch (err) {
            console.error(err);
            //next(err);
        }
    });

module.exports = router;