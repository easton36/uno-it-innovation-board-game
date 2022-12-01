const assert = require('assert');

// database logic is separated from the controller logic
const { findGame, insertGame } = require('../helpers/queries.helper');
const { generateGameCode } = require('../helpers/game.helper');

const MAX_PLAYERS = 10;

const fetchGame = async (req, res, next) => {
	try{
		// get game code from request
		const { gameCode } = req.params;

		// assertions throw an error if the provided condition is false
		assert(gameCode, 'Please provide a game code');

		// get game from database
		const game = await findGame(gameCode);
		assert(game, 'Invalid game code!');

		return res.status(200).json({
			success: true,
			data: {
				code: gameCode,
				status: game.status,
				gameId: game._id,
				deck: game.deck,
				gameLength: game.gameLength,
				players: game.players?.map(player => player._id)
			}
		});
	} catch(err){
		return next(err);
	}
};

const joinGame = async (req, res, next) => {
	try{
		// get game code from request
		const { code } = req.body;

		// assertions throw an error if the provided condition is false
		assert(code, 'Please provide a game code');

		// get game from database
		const game = await findGame(code);
		assert(game, 'Invalid game code!');

		// check if the game has already started
		assert(game.status === 'waiting_for_players', 'Game has already started!');

		// check if the current user is the creator of the game
		const isCreator = game.creator === req.user.id;
		assert(!isCreator, 'You cannot join your own game!');

		// check if the game is full
		const isFull = game.players?.length >= MAX_PLAYERS;
		assert(!isFull, 'Game is full!');

		// check if the user is already in the game
		const isInGame = game.players?.find(player => player._id === req.user.id);
		assert(!isInGame, 'You are already in this game!');

		// add the user to the game
		game.players.push({
			_id: req.user.id,
			points: 0,
			cards: [],
			answers: []
		});

		// save the game to the database
		await game.save();

		return res.status(200).json({
			success: true,
			data: {
				code,
				status: game.status,
				gameId: game._id,
				deck: game.deck,
				gameLength: game.gameLength,
				players: game.players?.map(player => player._id)
			}
		});
	} catch(err){ // all assertion errors are caught here and passed to the error handler
		return next(err);
	}
};

const createGame = async (req, res, next) => {
	try{
		const { deck = 'all', gameLength = 5 } = req.body;

		assert(deck, 'Please provide a deck');
		assert(['cybersecurity', 'bioinformatics', 'all'].includes(deck.toLowerCase()), 'Invalid deck type');

		assert(gameLength, 'Please provide a game length');
		assert([5, 10, 15].includes(Number(gameLength)), 'Invalid game length');

		const gameCode = generateGameCode();

		// create game in database
		const game = await insertGame(req.user.id, gameCode, deck, gameLength);
		assert(game, 'Failed to create game');

		return res.status(200).json({
			success: true,
			data: {
				code: gameCode,
				deck,
				gameLength,
				creator: req.user.id
			}
		});
	} catch(err){
		return next(err);
	}
};

const startGame = async (req, res, next) => {
	try{
		const { gameCode } = req.params;

		assert(gameCode, 'Please provide a game code');

		const game = await findGame(gameCode);
		assert(game, 'Invalid game code!');

		// only the game creator can start the game
		assert(game.creator === req.user.id, 'You are not the creator of this game!');
		// the game cannot have already started
		assert(game.status === 'waiting_for_players', 'Game has already started!');
		// the game must have at least 3 players
		assert(game.players?.length >= 3, 'Game must have at least 3 players to start!');

		// TODO - actually add logic to start the game
		// start the game
		game.status = 'in_progress';

		// save the game to the database
		await game.save();

		return res.status(200).json({
			success: true
		});
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
	pickCard,
	fetchGame,
	startGame
};