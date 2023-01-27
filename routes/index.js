const express = require('express');
const Event = require('../models/event');

const router = express.Router();

router
  .get('/', async (req, res, next) => {
    try {   
      res.render('main');
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

  .post('/', async (req, res) => {
    try {
      res.render('main');   
    } catch (err) {
      console.error(err);
      //next(err);
    }
  });

module.exports = router;