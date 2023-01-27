const express = require('express');
const { ExpressPeerServer } = require('peer');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);	// 세션 관련
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const methodOverride = require('method-override');
const fs = require('fs');
const readFile = require('read-file');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const peerServer = ExpressPeerServer(server, {
	debug: true,
});


dotenv.config();
const pageRouter = require('./routes/page');
const studyGroupRouter = require('./routes/studyGroup');
const studyGroupPageRouter = require('./routes/studyGroupPage');
const userRouter = require('./routes/user');
const userPageRouter = require('./routes/userPage');

const { sequelize } = require('./models');


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
	express: app,
	watch: true,
});
sequelize.sync({ force: false })
	.then(() => {
		console.log('데이터베이스 연결 성공');
	})
	.catch((err) => {
		console.error(err);
	});


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET,
	cookie: {
		httpOnly: true,
		secure: false,
	},
}));
app.use(methodOverride('_method'));
app.use('/peerjs', peerServer);


app.use('/group', studyGroupRouter);
app.use('/study-group', studyGroupPageRouter);
app.use('/user', userRouter);
app.use('/my', userPageRouter);
app.use('/', pageRouter);

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
	res.status(err.status || 500);
	res.render('error');
});




/****** Chat, Video ******/

io.on('connection', (socket) => {
	//video chat
	socket.on('join-room', (roomId, userId) => {
		socket.join(roomId);
	
		socket.on('connection-request', (roomId, userId, nickname) => {
			socket.to(roomId).emit('new-user-connected', userId, nickname);
		});
	
		socket.on('disconnect', () => {
			socket.to(roomId).emit('user-disconnected', userId);
		});
	});
});

server.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 대기중');
});