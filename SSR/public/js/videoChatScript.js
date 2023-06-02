// '/'에 접속하면 socket 생성
const socket = io();

const videoGrid = document.querySelector('#video-grid');
const muteBtn = document.querySelector('#mute-btn');
const cameraBtn = document.querySelector('#camera-btn');
const chatContent = document.querySelector('#chat-content');

const myPeer = new Peer({
    path: '/peerjs',
    host: '/',
    port: '3000'
});

const peers = [];

const myDiv = document.createElement('div');
const myVideo = document.createElement('video');
const myNickDiv = document.createElement('div');

myVideo.muted = true;

let myMicMuted = false;     // 현재 마이크 상태
let myCameraOff = false;    // 현재 카메라 상태

let room_id, user_id, user_name
myPeer.on('open', peerid => {
    room_id = ROOM_ID
    user_name = NICKNAME
    socket.emit('join-room', room_id, peerid, user_name)
})

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    // my stream
    user_name = NICKNAME
    addVideoStream(myDiv, myNickDiv, myVideo, user_name, stream);

    //call에 answer
    myPeer.on('call', call => {
        call.answer(stream);    
        const video = document.createElement('video');
        const nickDiv = document.createElement('span');
        const div = document.createElement('div');
        var callerName = call.metadata.callerName;
        
        call.on('stream', userVideoStream => {
            addVideoStream(div, nickDiv, video, callerName, userVideoStream)
            
        })
    })

    //새 유저 오면
    socket.on('new-user-connected', (data) => {
        setTimeout(() => {connectToNewUser(data.id, data.name, stream)}, 2000)
    })

    //내가 메세지 보낼 때 실행
    let text = $("input");
    $('html').keydown(function (e) {
        if (e.keyCode == 13 && text.val().length !== 0) {
            const value = text.val();
            const sender = NICKNAME;
        
            socket.emit('new-message', sender, text.val(), ROOM_ID, () => {
                addMessage(sender, `You: ${value}`);
            });
            text.val('')
        }
    });

    socket.on('new-message', addMessage);

    // 음소거 버튼
    muteBtn.addEventListener('click', () => {
        handleMuteClick(stream);
    });

    // 카메라 on/off 버튼
    cameraBtn.addEventListener('click', () => {
        handleCameraClick(stream);
    });
})


function addMessage(sender, message) {
    const ul = chatContent.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
    if (sender === NICKNAME) { //내가 보낸 메시지면
        li.style.textAlign = 'right';
    } 
    scrollToBottom();
}

function scrollToBottom() {
    $('#chat-content')
        .stop()
        .animate({ scrollTop: $('#chat-content')[0].scrollHeight }, 1000);
}

socket.on('user-disconnected', userId => {
    if (peers[userId]) {
        peers[userId].close();
    }
});

socket.on('update-video', (data) => {
    location.reload();
    
})

function connectToNewUser(userId, calleeName, stream) {
    const userDiv = document.createElement('div');
    const userNickDiv = document.createElement('div');
    const userVideo = document.createElement('video')
    
    const call = myPeer.call(userId, stream, {metadata: {callerName: NICKNAME}});

    // 상대방이 그들의 video stream 보내면 작동
    call.on('stream', userVideoStream => {
        addVideoStream(userDiv, userNickDiv, userVideo, calleeName, userVideoStream);
    });

    call.on('close', () => {
        removeVideoStream(userVideo, stream);
    });

    peers[userId] = call;
}

function addVideoStream(userDiv, userNickDiv, userVideo, userName, stream) {
    userNickDiv.innerText = userName;
    userVideo.srcObject = stream;
    userVideo.addEventListener('loadedmetadata', () => {
        userVideo.play();
    });

    userDiv.append(userVideo)
    userDiv.append(userNickDiv);
    videoGrid.append(userDiv);
}

function removeVideoStream(userVideo, stream) {
    userVideo.srcObject = stream;
    const videoParent = userVideo.parentNode;
    videoGrid.removeChild(videoParent);
    // location.reload(true);
}

$(window).on('beforeunload', function() {
    opener.location.reload()
});
  
const exit = () => {
    if (confirm("회의에서 나가시겠습니까?")){
        history.back(); 
    }
}

/* 마이크, 카메라 */

function handleMuteClick(stream) {
    // 모든 audio track의 상태를 반대로 만듦
    stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    if (!myMicMuted) {
        muteBtn.innerText = 'Unmute';
        myMicMuted = true;
    } else {
        muteBtn.innerText = 'Mute';
        myMicMuted = false;
    }
}

function handleCameraClick(stream) {
    // 모든 video track의 상태를 반대로 만듦
    stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));

    if (!myCameraOff) {
        cameraBtn.innerText = 'Turn Camera On';
        myCameraOff = true;
    } else {
        cameraBtn.innerText = 'Turn Camera Off';
        myCameraOff = false;
    }
}