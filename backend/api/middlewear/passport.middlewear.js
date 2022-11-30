const passport = require('passport');
const assert = require('assert');

const JWTStrategy = require('passport-jwt').Strategy;

const { tokenExtractor } = require('./helpers/auth.helper');

const JWT_PARAMS = {
	secretOrKey: process.env.JWT_SECRET,
	jwtFromRequest: tokenExtractor
};

passport.use(new JWTStrategy(JWT_PARAMS, async (jwtPayload, done) => {
	try{
		assert(Date.now() <= jwtPayload.expiration, 'UnauthorizedError');

		return done(null, {
			...jwtPayload
		});
	} catch(err){
		done(err);
	}
}));

module.exports = passport;