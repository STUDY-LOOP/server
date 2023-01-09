const { StudyGroup, StudyMember, StudyRule, StudySchedule, User } = require('../models');
const { v4: uuidv4 } = require('uuid');

// 진행: 완료
// 스터디 생성
exports.create = async (req, res, next) => {
	const { groupName, groupLeader, rule, scheduleDay, scheduleHour, scheduleMinute } = req.body;
	groupId = uuidv4();
	try {
		await User.create({
			email: groupLeader,
			nick: 'jinseo',
			password: 'password',
		});
		await StudyGroup.create({
			groupId,
			groupName,
			groupLeader,
		});
		await StudySchedule.create({
		    groupId,
		    scheduleDay,
		    scheduleHour, 
		    scheduleMinute,
		});
		await StudyRule.create({
		    groupId,
		    rule,
		});        
		return res.redirect('/study-group/'+groupId);
	} catch(error) {
		//console.log("ERROR!");
		console.error(error);
		return next(error);
	}
}

// 진행: 완료
// 스터디 가입
exports.join = async (req, res, next) => {
	const { userName, groupId } = req.body;
	try {
		await User.create({
			email: userName,
			nick: userName,
			password: 'password',
		});
		await StudyMember.create({
			groupId,
			email: userName,
		});
		return res.redirect('/study-group/'+groupId);
	} catch(error) {
		console.error(error);
		return next(error);
	}
}

// 진행: 완료
// 스터디 탈퇴
exports.quit = async (req, res, next) => {
	const { email, groupId } = req.body;
	try{
		await StudyMember.destroy({
			where: { 
				groupId,
				email,
			}
		});
		return res.redirect('/study-group/'+groupId);
	}catch(error){
		console.error(error);
		return next(error);
	}
}

// 진행: 완료
// 스터디 설정 변경
exports.modify = async (req, res, next) => {
	const { 
		groupId, groupName, groupLeader, rule,
		scheduleDay, scheduleHour, scheduleMinute,
	} = req.body;

	try {
		///////////////////// 테이블 구조 바꿔야.. 하나...? 같이 삭제되도록
		await StudyGroup.update(
			{ groupId, groupName, groupLeader },
			{ where: { groupId: groupId} },
		);
		await StudyRule.update(
			{ groupId, rule },
			{ where: { groupId: groupId} },
		);
		await StudySchedule.update(
			{ groupId, scheduleDay, scheduleHour, scheduleMinute },
			{ where: { groupId: groupId} },
		);//////////////// 스케줄 여러개인 경우에 어떡하지?

		return res.redirect('/study-group/'+groupId);
	} catch(error) {
		console.error(error);
		return next(error);
	}
}

// 진행: 거의 완료 (시퀄라이즈 수정해서 DB 연동해야함)
// 스터디 삭제
exports.remove = async (req, res, next) => {
	const { groupId } = req.body;
	///////////////////// 이거 db 연결해놓으면 하나만 지워도 다 지워질듯 (디비수정필요)
	try{
		await StudyGroup.destroy({
			where: { groupId: groupId }
		});
		await StudyMember.destroy({
			where: { groupId: groupId }
		});
		await StudyRule.destroy({
			where: { groupId: groupId }
		});
		await StudySchedule.destroy({
			where: { groupId: groupId }
		});
		return res.redirect('/study-groups');
	}catch(error){
		console.error(error);
		return next(error);
	}
}