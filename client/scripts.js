import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

let currentRoom = '';

socket.on('connect', () => {
	console.log(` Kết nối thành công với ID: ${socket.id}`);
});

socket.on('message', (msg) => {
	console.log(`Tin nhắn từ server: ${msg}`);
	const li = document.createElement('li');
	li.textContent = msg;
	document.getElementById('messages').appendChild(li);
});

socket.on('typing', (msg) => {
	console.log('msg: ', msg);
	document.getElementById('typingIndicator').innerHTML = msg;
});

socket.on('stopTyping', (msg) => {
	document.getElementById('typingIndicator').innerHTML = '';
});

const leaveRoom = () => {
	if (currentRoom) {
		socket.emit('leaveRoom', currentRoom);
		const li = document.createElement('li');
		li.textContent = ` Bạn đã rời phòng ${currentRoom}`;
		document.getElementById('messages').appendChild(li);
		currentRoom = '';
	}
};
document.getElementById('leave').onclick = leaveRoom();
document.getElementById('join').onclick = () => {
	const room = document.getElementById('room').value;

	console.log('join');
	if (room) {
		if (currentRoom) {
			leaveRoom();
		}
	}

	socket.emit('joinRoom', room);
	currentRoom = room;

	document.getElementById('messages').innerHTML = '';
	const li = document.createElement('li');
	li.textContent = ` Bạn đã tham gia phòng ${room}`;
	document.getElementById('messages').appendChild(li);
};

document.getElementById('send').onclick = () => {
	const message = document.getElementById('message').value;
	if (!message || !currentRoom) {
		return alert('Vui lòng nhập tin nhắn và tên phòng!');
	}
	socket.emit('message', currentRoom, message);

	const li = document.createElement('li');
	li.textContent = message;
	document.getElementById('messages').appendChild(li);
	document.getElementById('message').value = '';
};

document.getElementById('message').oninput = () => {
	if (!currentRoom) return;
	console.log('oninput');
	socket.emit('typing', currentRoom);
	setTimeout(() => {
		socket.emit('stopTyping', currentRoom);
	}, 2000);
};
