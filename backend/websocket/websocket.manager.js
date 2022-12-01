const { Server } = require('socket.io');

const { authentication } = require('./websocket.middlewear');

const connections = {};
let io;

const initialize = (server) => {
	io = new Server(server, {
		cors: {
			credentials: true,
			methods: ['GET', 'POST']
		}
	});

	// socket.io jwt auth middlewear
	io.use(authentication);

	// when a socketio connection is made
	io.on('connection', (socket) => {
		if(!socket.user) return;

		if(!connections[socket.user.id]){
			connections[socket.user.id] = [socket.id];
		} else{
			connections[socket.user.id].push(socket.id);
		}

		console.log(`[SOCKETIO] ${socket.user.id} connected with socket id ${socket.id}`);

		// emit authorized event
		socket.emit('authenticated', {
			id: socket.user.id
		});

		// socket events
		socket.on('disconnect', () => {
			delete connections[socket.user.id][connections[socket.user.id].indexOf(socket.id)];
		});
	});

	console.log('[WEBSOCKET] Initialized');
};

const joinRoom = (userId, roomName) => {
	if(connections[userId]){
		connections[userId].forEach((socketId) => {
			io.sockets.sockets.get(socketId)?.join(roomName);
		});
	}

	// announce to room that user has joined
	io.to(roomName).emit('game:user:join', {
		userId,
		timestamp: Date.now()
	});

	return true;
};

const leaveRoom = (userId, roomName) => {
	if(!connections[userId]){
		connections[userId].forEach((socketId) => {
			io.sockets.sockets.get(socketId)?.leave(roomName);
		});
	}

	// announce to room that user has left
	io.to(roomName).emit('game:user:leave', {
		userId,
		timestamp: Date.now()
	});

	return true;
};

const getUserRooms = (userId) => {
	if(!connections[userId]) return [];

	const rooms = [];

	connections[userId].forEach((socketId) => {
		const socket = io.sockets.sockets.get(socketId);

		Object.keys(socket.rooms).forEach((room) => {
			if(room !== socket.id){
				rooms.push(room);
			}
		});
	});

	return rooms;
};

const sendUserCards = (userId, cards) => {
	if(!connections[userId]) return false;

	connections[userId].forEach((socketId) => {
		io.to(socketId).emit('game:user:cards', {
			cards,
			cardCzar: cards.length === 0,
			timestamp: Date.now()
		});
	});

	return true;
};

const sendRoundStart = (roomName, {
	blackCard,
	cardCzar,
	round,
	players
}) => {
	io.to(roomName).emit('game:round:start', {
		blackCard,
		cardCzar,
		round,
		players,
		timestamp: Date.now()
	});

	return true;
};

module.exports = {
	initialize,
	joinRoom,
	leaveRoom,
	getUserRooms,
	sendUserCards,
	sendRoundStart
};