const CONFIG = require('../../config');

module.exports = (err, req, res, next) => {
	console.log(`[API ERROR] [${req.originalUrl}] [USER - ${req?.user?.id || 'NOT AUTHENTICATED'}] ${err?.message || err}`);
	if(!CONFIG.PRODUCTION){
		console.log(err);
	}

	if(typeof (err) === 'string'){
		// custom application error
		return res.status(400).json({ status: 400, message: err });
	}

	if(err.message === 'UnauthorizedError' || err.message === 'Unauthorized'){
		// jwt authentication error
		return res.status(401).json({ status: 401, message: 'You are not allowed to access this resource.' });
	}

	if(err.message === 'Ratelimited'){
		// ratelimit error
		return res.status(429).json({ status: 429, message: 'Ratelimited. Please try again later.' });
	}

	// default to 500 server error
	return res.status(500).json({ status: 500, message: err.message });
};