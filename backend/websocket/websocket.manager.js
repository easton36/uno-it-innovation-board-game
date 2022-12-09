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

const joinRoom = (user, roomName, announce) => {
	if(connections[user.id]){
		connections[user.id].forEach((socketId) => {
			io.sockets.sockets.get(socketId)?.join(roomName);
		});
	}

	if(announce){
		// announce to room that user has joined
		io.to(roomName).emit('game:user:join', {
			id: roomName,
			userId: user.id,
			name: user.name,
			timestamp: Date.now()
		});
	}

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
		id: roomName,
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
			cards: cards.map(card => ({
				...card,
				id: card._id
			})),
			cardCzar: cards.length === 0,
			timestamp: Date.now()
		});
	});

	return true;
};

const sendRoundStart = (roomName, {
	questionCard,
	cardCzar,
	round,
	players
}) => {
	io.to(roomName).emit('game:round:start', {
		id: roomName, // game code
		questionCard: {
			...questionCard,
			id: questionCard._id
		},
		cardCzar,
		round,
		players,
		timestamp: Date.now()
	});

	return true;
};

const sendRoundCardPicked = (roomName, {
	round,
	card,
	cardCzar
}) => {
	io.to(roomName).emit('game:round:picked', {
		id: roomName, // game code
		round,
		card: {
			...card,
			id: card._id
		},
		cardCzar,
		timestamp: Date.now()
	});

	return true;
};

const sendCardPicked = (roomName, user) => {
	io.to(roomName).emit('game:user:picked', {
		id: roomName, // game code
		userId: user.id,
		name: user.name,
		timestamp: Date.now()
	});

	return true;
};

const sendCardCzarCard = (roomName, cardCzar, {
	userId,
	card
}) => {
	if(!connections[cardCzar]) return false;

	connections[cardCzar].forEach((socketId) => {
		io.to(socketId).emit('game:round:card', {
			userId,
			card: {
				...card,
				id: card._id
			},
			timestamp: Date.now()
		});
	});

	return true;
};

const sendRoundEnd = (roomName, {
	round,
	questionCard,
	cardCzar,
	answers
}) => {
	io.to(roomName).emit('game:round:end', {
		id: roomName, // game code
		round,
		questionCard: {
			...questionCard,
			id: questionCard._id
		},
		cardCzar,
		answers: answers.map(answer => ({
			...answer,
			id: answer._id
		})),
		timestamp: Date.now()
	});

	return true;
};

const sendRoundWinnerPicked = (roomName, {
	round,
	winner,
	points = 5,
	winningCard
}) => {
	io.to(roomName).emit('game:round:winner', {
		id: roomName, // game code
		round,
		winner,
		points,
		winningCard: {
			...winningCard,
			id: winningCard._id
		},
		timestamp: Date.now()
	});

	return true;
};

const sendGameEnd = (roomName, {
	rounds,
	players,
	winner
}) => {
	io.to(roomName).emit('game:end', {
		id: roomName, // game code
		rounds,
		players,
		winner,
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
	sendRoundStart,
	sendRoundCardPicked,
	sendCardPicked,
	sendRoundEnd,
	sendRoundWinnerPicked,
	sendGameEnd,
	sendCardCzarCard
};