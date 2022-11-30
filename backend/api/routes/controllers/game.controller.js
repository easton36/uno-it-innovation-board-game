const assert = require('assert');

// database logic is separated from the controller logic
const { findGame } = require('../helpers/queries.helper');

const joinGame = async (req, res, next) => {
	try{
		// get game code from request
		const { code } = req.body;

		// assertions throw an error if the provided condition is false
		assert(code, 'Please provide a game code');

		// get game from database
		const game = await findGame(code);
		assert(game, 'Invalid game code!');
	} catch(err){ // all assertion errors are caught here and passed to the error handler
		return next(err);
	}
};

const createGame = async (req, res, next) => {
	try{
		const { deck = 'all', maxPlayers, gameLength } = req.body;

		assert(deck, 'Please provide a deck');
		assert(['cybersecurity', 'bioinformatics', 'all'].includes(deck.toLowerCase()), 'Invalid deck type');
	} catch(err){
		return next(err);
	}
};

const pickCard = async (req, res, next) => {
	try{
		const { gameCode } = req.params;

		assert(gameCode, 'Please provide a game code');
	} catch(err){
		return next(err);
	}
};

module.exports = {
	joinGame,
	createGame,
	pickCard
};