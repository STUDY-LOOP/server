const { StudyGroup, StudyMember, StudyRule, StudySchedule } = require('../models');

// 진행: 완료
exports.renderMain = (req, res) => {
	res.render('main');
}

// 진행: 완료
exports.renderShowAllGroups = async (req, res) => {
	try{
		const result = await StudyGroup.findAll({
			//attributes:['groupName']
		});
		return res.render('showAllGroups', {
			title: '스터디 목록',
			groups: result,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
};

// 진행: 완료
exports.renderCreateGroup = (req, res) => {
	res.render('createGroup', { title: '스터디 만들기' });
};

// 진행: 완료
exports.renderStudyMain = async (req, res) => {
	try{
		//const groupId = req.params.groupId;
		const groupId = req.body.groupId;

		///////////// 테이블 다 join 해서 한 번에 가져오면 쿼리 간단해질지도?
		const group = await StudyGroup.findOne({
			where: { groupId: groupId }
		});
		const rule = await StudyRule.findOne({
			where: { groupId: groupId }
		});
		const schedule = await StudySchedule.findOne({
			where: { groupId: groupId }
		});
		const members = await StudyMember.findAll({
			where: { groupId: groupId }
		});
		return res.render('studyMain', {
			title: '스터디 홈',
			group, rule, schedule, members,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
};

// 진행: 완료
exports.renderStudySetting = async (req, res) => {
	try{
		const group = await StudyGroup.findOne({
			where: { groupId: req.params.groupId }
		});
		const rules = await StudyRule.findOne({
			where: { groupId: req.params.groupId }
		});
		const schedules = await StudySchedule.findAll({
			where: { groupId: req.params.groupId }
		});

		return res.render('studySetting', {
			title: '스터디 설정',
			group,
			rules,
			schedules,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
};

// 진행: 완료
exports.renderStudyMember = async (req, res) => {
	try{
		const group = await StudyGroup.findOne({
			where: { groupId: req.params.groupId }
		});
		const members = await StudyMember.findAll({
			where: { groupId: req.params.groupId }
		});

		return res.render('studyMember', {
			title: '스터디원 정보',
			group,
			members,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
};

