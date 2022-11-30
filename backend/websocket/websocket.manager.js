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

module.exports = {
	initialize
};