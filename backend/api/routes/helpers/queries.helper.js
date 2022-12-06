const { Game } = require('../../../database/Schemas');

const findGame = async (code) => {
	const game = await Game.findById(code);

	return game;
};

const insertGame = async (creator, code, deck, gameLength) => {
	const game = await new Game({
		_id: code,
		code,
		deck,
		creator: creator.id,
		gameLength,
		players: [{ _id: creator.id, name: creator.name }],
		rounds: []
	}).save();

	return game;
};

const checkGamesForUserId = async (userId) => {
	const games = await Game.findOne({
		'players._id': userId,
		status: {
			$ne: 'finished'
		}
	});

	return games;
};

module.exports = {
	findGame,
	insertGame,
	checkGamesForUserId
};