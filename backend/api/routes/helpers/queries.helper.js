const { Game } = require('../../../database/Schemas');

const findGame = async (code) => {
	const game = await Game.findById(code);

	return game;
};

module.exports = {
	findGame
};