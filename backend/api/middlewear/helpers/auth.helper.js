const tokenExtractor = (req) => {
	const authCookie = req.cookies.token;
	if(authCookie){
		return authCookie;
	}

	const authHeader = req.get('authorization');
	if(authHeader && authHeader.startsWith('Bearer ')){
		return authHeader.split(' ')[1];
	}

	return null;
};

module.exports = {
	tokenExtractor
};