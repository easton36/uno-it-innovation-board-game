const assert = require('assert');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const { checkGamesForUserId } = require('../api/routes/helpers/queries.helper');

const authentication = async (socket, next) => {
	try{
		const authCookie = cookie.parse(socket?.handshake?.headers?.cookie || '')?.token;
		const authHeader = socket?.handshake?.headers?.authorization;

		assert(authCookie || (authHeader && authHeader.startsWith('Bearer ')), 'UnauthorizedError');

		const token = authCookie || authHeader.split(' ')[1];
		assert(token, 'UnauthorizedError');

		// decode jwt and check if expired
		const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

		// check if the user is in any active games
		const userGame = await checkGamesForUserId(jwtPayload.userId);
		if(userGame){
			// if the user is in an active game, join the game's websocket room
			socket.join(userGame.code);
		}

		socket.user = {
			...jwtPayload,
			id: jwtPayload.userId
		};

		return next();
	} catch(err){
		return next(err);
	}
};

module.exports = {
	authentication
};