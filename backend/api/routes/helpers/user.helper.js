const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const validateToken = async (token) => {
	try{
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		return decoded;
	} catch(err){
		return false;
	}
};

const generateToken = async () => {
	const userId = uuid();

	const token = jwt.sign({ userId }, process.env.JWT_SECRET);

	return {
		token,
		userId
	};
};

module.exports = {
	validateToken,
	generateToken
};