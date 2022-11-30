const CODE_LENGTH = 6;
const CODE_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

const generateGameCode = () => {
	let result = '';

	for(let i = 0; i < CODE_LENGTH; i++){
		result += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
	}

	return result;
};

module.exports = {
	generateGameCode
};