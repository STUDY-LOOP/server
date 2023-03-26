const { User, StudyGroup, Chat } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* exports.joinChatRoom = async (req, res, next) => {
  try {
    io.on('connection', (socket) => {
      console.log(socket.rooms);
      socket.join(`${gpId}`);
      console.log(socket.rooms);
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}; */

exports.saveChat = async (req, res, next) => {
  try {
    const groupPublicId = req.body.gpId;
    //console.log(`그룹 아이디 확인: ${groupPublicId}`);
    const values = groupPublicId.split('=');
    //console.log(`벨류 값 확인: ${values}`);
    const group_dev = await StudyGroup.findOne({
      where: {
        groupName: values[0],
        groupId: { [Op.like]: values[1] + '%' },
      },
    });
    //console.log(`그룹 데브 값 확인: ${group_dev.groupId}`);
    //console.log(`콘텐트 값 확인: ${req.body.content}`);
    //console.log(`이메일 값 확인: ${req.body.email}`);
    await Chat.create({
      groupId: group_dev.groupId,
      email: req.body.email,
      notice: 0,
      content: req.body.content,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
