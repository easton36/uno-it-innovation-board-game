const assert = require('assert');

const { validateToken, generateToken } = require('../helpers/user.helper');
const { checkGamesForUserId } = require('../helpers/queries.helper');
const Websocket = require('../../../websocket/websocket.manager');

const initializeUser = async (req, res, next) => {
	try{
		const token = req.cookies?.token || req.get('Authorization')?.split(' ')[1];

		let validToken;
		let userToken;
		let userId;
		let userName;
		let activeGame;

		if(token){ // if a token is provided, validate it
			validToken = await validateToken(token);

			if(validToken){ // if the user already has a valid token, use it
				userToken = token;
				userId = validToken.userId;
				userName = validToken.name;

				// check if the user is in any active games
				const userGame = await checkGamesForUserId(userId);
				if(userGame){
					activeGame = userGame.code;
				}
			}
		}

		if(!token || !validToken){ // generate the user a new token if they don't have one or if their token is invalid
			const { name } = req.query;

			assert(name, 'Please provide a name');
			assert(name.length <= 20, 'Name must be less than 20 characters');
			// name must be alphanumeric
			assert(name.match(/^[a-zA-Z0-9]+$/), 'Name must be alphanumeric');

			const { token, userId: tokenUserId } = await generateToken(name);

			userToken = token;
			userId = tokenUserId;
		}

		res.setHeader('Authorization', 'Bearer ' + userToken); // set the token in the header

		res.cookie('token', userToken, { httpOnly: true }); // set the token in a cookie
		res.cookie('userId', userId, { httpOnly: true }); // set the user id in a cookie

		return res.status(200).json({
			success: true,
			token: userToken,
			userId,
			name: userName,
			activeGame
		});
	} catch(err){
		return next(err);
	}
};

module.exports = {
	initializeUser
};