const { Server } = require('socket.io');
const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
	console.log('Server on Port 3000');
});
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const io = new Server(server, {
	cors: {
		origin: '*',
		credentials: true
	}
});


//web sokcets  
io.on('connection', socket => {
	console.log('client ' + socket.id + ' connected');
	//console.log(socket.handshake);
	socket.broadcast.emit('data', 'client ' + socket.id + 'connected');

	socket.on('drawLineSocket', data => {
		socket.broadcast.emit('drawLineSocket', data);
	});

	socket.on('clearBoardSocket', () => {
		socket.broadcast.emit('clearBoardSocket');
	});
});

io.listen(3001);
