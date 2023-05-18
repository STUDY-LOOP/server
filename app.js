const express = require('express');
const { ExpressPeerServer } = require('peer');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const MemoryStore = require('memorystore')(session); // 세션
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const methodOverride = require('method-override');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createServer } = require('http');

dotenv.config();

const { sequelize } = require('./models');
const passportConfig = require('./passport');

/* --- server --- */

const app = express();
passportConfig();
const httpServer = createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: true,
  },
});
const peerServer = ExpressPeerServer(httpServer, {
  debug: true,
});

app.set('port', 3000);
httpServer.listen(process.env.PORT || 3000, () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
sequelize
  .sync({
    alter: false,
    force: false,
  })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(
  cors({
    credentials: true,
    origin: [
      'http://43.201.202.121',
      'http://ec2-43-201-202-121.ap-northeast-2.compute.amazonaws.com',
      'http://localhost:3001',
    ],
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: false,
      secure: false,
    },
  })
);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/test-page', express.static(path.join(__dirname, 'test-page')));
app.use(
  '/datetimepicker',
  express.static(path.join(__dirname, 'datetimepicker'))
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/peerjs', peerServer);

/* --- router --- */

const apiRouter = require('./routes/api');
//const apiEventsRouter = require('./routes/apiEvents');
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const userPageRouter = require('./routes/userPage');
const studyGroupRouter = require('./routes/studyGroup');
const studyGroupPageRouter = require('./routes/studyGroupPage');
const eventsRouter = require('./routes/events');

app.get('/', (req, res, next) => {
  return;
});
app.use('/api', apiRouter);
//app.use('/apiEvents', apiEventsRouter);
app.use('/events', eventsRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/my', userPageRouter);
app.use('/group', studyGroupRouter);
app.use('/study-group', studyGroupPageRouter);

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

/* --- chat, video chat --- */

io.on('connection', (socket) => {
  //study main chat

  socket.on('enter_chat_room', (room) => {
    socket.join(room);
    console.log(socket.rooms);
  });

  socket.on('new_msg', (userNick, content, datetime, room) => {
    io.to(room).emit('new_msg', userNick, content, datetime);
    //done(); //triggers function located at frontend
  });

  socket.on('new_notice', (userNick, content, datetime, room) => {
    io.to(room).emit('new_notice', userNick, content, datetime);
    //done();
  });

  let room, id, name;
  //video chat
  socket.on('join-room', (roomId, userId, userName) => {
    room = roomId;
    id = userId;
    name = userName;

    socket.join(roomId);
    socket.to(roomId).emit('new-user-connected', { id: id, name: name });
  });
  //chat
  socket.on('new-message', (sender, content, datetime, roomId) => {
    io.to(roomId).emit('new-message', sender, content, datetime);
  });

  /* socket.on('disconnect', (roomId, userId, userName) => {
    socket.to(roomId).emit('user-disconnected', userId);
    socket.to(roomId).emit('update-video', { id: userId, name: userName });
  }); */
});
