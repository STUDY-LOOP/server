const { User, StudyGroup, StudyRule, StudySchedule, AssignmentBox, Assignment, StudyLog } = require('../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// 객체가 비었는지 확인
const isEmptyObj = function(obj)  {
    if(Object.keys(obj).length === 0){
      return true;
    }    
    return false;
};


// groupName과 groupId를 groupPublicId로 변환
exports.toPublicId = function(groupName, groupId){
    const gpid = groupId.substr(0, 7);
    return `${groupName}=${gpid}`
};

// 사용자가 스터디장인지 확인
exports.isLeaderOf = async function(email, publicId){
    const values = publicId.split('=');
    const group_dev = await StudyGroup.findOne({ 
        where: {
            groupName: values[0],
            groupId: { [Op.like]: values[1] + "%" },
        }
    });

    if(email === group_dev.groupLeader){
        return true;
    }
    return false;
};

// 사용자가 스터디 소속인지 확인
exports.isMemberOf = async function(email, publicId){
    const values = publicId.split('=');
    const group_dev = await StudyGroup.findOne({ 
        where: {
            groupName: values[0],
            groupId: { [Op.like]: values[1] + "%" },
        }
    });
    const member = await group_dev.getUsers({ where: { email: email } });
    
    if(!isEmptyObj(member) || email === group_dev.groupLeader){
        return true;
    }
    return false;
};