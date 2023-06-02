const { User, StudyGroup, Chat } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.loadChat = async (req, res, next) => {
  try {
    const groupPublicId = req.params.gpId;
    const group = await StudyGroup.findOne({ where: { groupPublicId } });
    const chats = await Chat.findAll({
      raw: true,
      where: { groupId: group.groupId, notice: 0 },
      attributes: [
        'userNick',
        'notice',
        'content',
        'datetime',
      ],
    });

    return res.json(chats);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.loadNotice = async (req, res, next) => {
  try {
    const groupPublicId = req.params.gpId;
    const group = await StudyGroup.findOne({ where: { groupPublicId } });
    const notices = await Chat.findAll({
      raw: true,
      where: { groupId: group.groupId, notice: 1 },
      attributes: [
        'userNick',
        'notice',
        'content',
        'datetime',
      ],
    });

    return res.json(notices);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.saveChat = async (req, res, next) => {
  try {
    const groupPublicId = req.params.gpId;
    const group = await StudyGroup.findOne({ where: { groupPublicId } });
    await Chat.create({
      groupId: group.groupId,
      email: req.body.email,
      notice: 0,
      content: req.body.content,
      userNick: req.body.userNick,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.saveNotice = async (req, res, next) => {
  try {
    const groupPublicId = req.params.gpId;
    const group = await StudyGroup.findOne({ where: { groupPublicId } });
    await Chat.create({
      groupId: group.groupId,
      email: req.body.email,
      notice: 1,
      content: req.body.content,
      userNick: req.body.userNick,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
