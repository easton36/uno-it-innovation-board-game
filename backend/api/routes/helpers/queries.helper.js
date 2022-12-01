const { Game } = require('../../../database/Schemas');

const findGame = async (code) => {
	const game = await Game.findById(code);

	return game;
};

const insertGame = async (creator, code, deck, gameLength) => {
	const game = await new Game({
		_id: code,
		deck,
		creator,
		gameLength,
		players: [{
			_id: creator,
			points: 0,
			cards: [],
			answers: []
		}]
	}).save();

	return game;
};

module.exports = {
	findGame,
	insertGame
};