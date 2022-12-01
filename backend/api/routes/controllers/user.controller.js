const assert = require('assert');

const { validateToken, generateToken } = require('../helpers/user.helper');

const initializeUser = async (req, res, next) => {
	try{
		const token = req.cookies?.token || req.get('Authorization')?.split(' ')[1];

		let validToken;
		let userToken;
		let userId;

		if(token){ // if a token is provided, validate it
			validToken = await validateToken(token);

			if(validToken){ // if the user already has a valid token, use it
				userToken = token;
				userId = validToken.userId;
			}
		}

		if(!token || !validToken){ // generate the user a new token if they don't have one or if their token is invalid
			const { token, userId: tokenUserId } = await generateToken();

			userToken = token;
			userId = tokenUserId;
		}

		res.setHeader('Authorization', 'Bearer ' + userToken); // set the token in the header

		res.cookie('token', userToken, { httpOnly: true }); // set the token in a cookie
		res.cookie('userId', userId, { httpOnly: true }); // set the user id in a cookie

		return res.status(200).json({
			success: true,
			token: userToken
		});
	} catch(err){
		return next(err);
	}
};

module.exports = {
	initializeUser
};