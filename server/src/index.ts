import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

io.on('connection', (socket: Socket) => {
	console.log(` Người dùng kết nối: ${socket.id}`);

	// Xử lý sự kiện tham gia phòng
	socket.on('joinRoom', (room: string) => {
		socket.join(room);
		console.log(` Người dùng: ${socket.id} đã tham gia phòng`);
		socket
			.to(room)
			.emit('message', ` Người dùng ${socket.id} vừa tham gia phòng`);
	});

	// Xử lý sự kiện rời phòng
	socket.on('leaveRoom', (room: string) => {
		socket.leave(room);
		console.log(` Người dùng: ${socket.id} đã rời khỏi phòng`);
		socket
			.to(room)
			.emit('message', ` Người dùng ${socket.id} vừa rời khỏi phòng`);
	});

	// Xử lý tin nhắn
	socket.on('message', (room: string, msg: string) => {
		io.to(room).emit('message', msg);
	});

    // Typing event
    socket.on('typing', (room: string) => {
        console.log(`${socket.id} đang gõ`)
        socket.broadcast.to(room).emit('typing', `${socket.id} đang gõ`);
    })

    // Stop typing event
    socket.on('stopTyping', (room: string) => {
        console.log(`${socket.id} ngừng gõ`)
        socket.broadcast.to(room).emit('stopTyping', `${socket.id} ngừng gõ`);
    })

	socket.on('disconnect', () => {
		console.log(` Người dùng: ${socket.id} đã ngắt kết nối`);
	});
});

const PORT = 3001;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
