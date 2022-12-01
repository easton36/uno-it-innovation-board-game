const tokenExtractor = (req) => {
	const token = req.cookies?.token || req.get('Authorization')?.split(' ')[1];

	return token;
};

module.exports = {
	tokenExtractor
};