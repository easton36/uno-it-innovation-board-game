const assert = require('assert');

// database logic is separated from the controller logic
const { findGame, insertGame } = require('../helpers/queries.helper');
const { generateGameCode, initiateNextRound, mapGamePlayers, validateQuestionCard, validateAnswerCard } = require('../helpers/game.helper');
const Websocket = require('../../../websocket/websocket.manager');

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

		const gameData = {
			id: gameCode,
			code: gameCode,
			status: game.status,
			creator: game.creator,
			players: game.players?.map(mapGamePlayers),
			deck: game.deck,
			round: game.round,
			roundStatus: game?.rounds[game.round - 1]?.status,
			cardCzar: game?.rounds[game.round - 1]?.cardCzar,
			questionCard: {
				...game?.rounds[game.round - 1]?.questionCard._doc,
				id: game?.rounds[game.round - 1]?.questionCard?._id
			},
			cards: game.players?.find(player => player._id === req.user?.id).cards?.map(card => ({
				...card._doc,
				id: card._id
			})),
			rounds: game.rounds?.map(round => ({
				id: round._id,
				cardCzar: round.cardCzar,
				round: round.round,
				questionCard: round.questionCard,
				winner: round.winner,
				winningCard: round.winningCard,
				answers: round.answers
			}))
		};

		if(game.rounds[game.round - 1]?.cardCzar === req.user.id){
			gameData.answers = game.rounds[game.round - 1]?.answers?.map(card => ({
				...card._doc,
				id: card._id
			}));
		}

		// join the game's websocket room
		Websocket.joinRoom(req.user, gameCode);

		return res.status(200).json({
			success: true,
			data: gameData
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

		// check if the user is already in a game
		const userGames = await Websocket.getUserRooms(req.user.id);
		assert(userGames.length === 0, 'You are already in a game!');

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
			name: req.user.name,
			points: 0,
			cards: []
		});

		// save the game to the database
		await game.save();

		// join user to websocket room
		Websocket.joinRoom(req.user, code, true);

		return res.status(200).json({
			success: true,
			data: {
				id: code,
				code,
				status: game.status,
				creator: game.creator,
				players: game.players?.map(mapGamePlayers),
				deck: game.deck,
				round: game.round,
				user: game.players.find(player => player._id === req.user.id),
				rounds: []
			}
		});
	} catch(err){ // all assertion errors are caught here and passed to the error handler
		return next(err);
	}
};

const createGame = async (req, res, next) => {
	try{
		const { deck = 'base', gameLength = 5 } = req.body;

		assert(deck, 'Please provide a deck');
		assert(['cybersecurity', 'bioinformatics', 'base'].includes(deck.toLowerCase()), 'Invalid deck type');

		assert(gameLength, 'Please provide a game length');
		assert([5, 10, 15].includes(Number(gameLength)), 'Invalid game length');

		// check if the user is already in a game
		const userGames = await Websocket.getUserRooms(req.user.id);
		assert(userGames.length === 0, 'You are already in a game!');

		const gameCode = generateGameCode();

		// create game in database
		const game = await insertGame(req.user, gameCode, deck, gameLength);
		assert(game, 'Failed to create game');

		// join user to websocket room
		Websocket.joinRoom(req.user, gameCode, true);

		console.log(`[GAME] ${req.user.id} created a game: ${gameCode}`);

		return res.status(200).json({
			success: true,
			data: {
				id: gameCode,
				code: gameCode,
				status: game.status,
				creator: game.creator,
				players: game.players?.map(mapGamePlayers),
				deck: game.deck,
				round: game.round,
				rounds: []
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
		// the game must have at least 3 players
		assert(game.players?.length >= 3, 'Game must have at least 3 players to start!');
		assert(game.status !== 'finished', 'This game has already finished!');
		if(game.status === 'in_progress'){
			// the game current round cannot have already started
			assert(game.rounds[game.round - 1]?.status === 'finished', 'Wait until the previous round has finished!');
		}

		const {
			round,
			newRound,
			questionCard,
			cardCzar,
			playerRoundCards
		} = await initiateNextRound(gameCode);

		// tell each player what cards they have
		for(const player of game.players){
			if(player._id === cardCzar?._id){
				Websocket.sendUserCards(player._id, []);
			} else{
				Websocket.sendUserCards(player._id, playerRoundCards[player._id]);
			}
		}

		// inform everyone of the new round
		Websocket.sendRoundStart(gameCode, {
			questionCard,
			cardCzar: cardCzar?._id,
			round,
			players: game.players?.map(player => player._id)
		});

		console.log(`[GAME] ${req.user.id} joined game ${gameCode}`);

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
		const { cardId } = req.body;

		assert(gameCode, 'Please provide a game code');
		assert(cardId, 'Please pick a card');

		const game = await findGame(gameCode);
		assert(game, 'Invalid game code!');
		// make sure the game has started
		assert(!['waiting_for_players', 'finished'].includes(game.status), 'Game has not started yet!');

		// make sure the user is in the game
		const player = game.players?.find(player => player._id === req.user.id);
		assert(player, 'You are not in this game!');

		// current game round
		const round = game.rounds[game.round - 1];

		// card czar cannot pick an answer card!
		assert(round.cardCzar !== req.user.id, 'You cannot pick an answer!');

		// fetch card from database / make sure it exists
		const card = validateAnswerCard(cardId, game.deck);
		assert(card, 'Invalid card!');

		// check if player is allowed to pick a card
		assert(round.status === 'players_choosing_cards', 'You can\'t pick a card right now!');
		// make sure the user has not already picked a card
		assert(!round.answers?.find(answer => answer.owner === req.user.id), 'You have already picked a card!');
		// make sure the card is in the user's hand
		assert(player?.cards?.find(card => card._id === cardId), 'You don\'t have that card!');

		const formattedCard = {
			...card,
			owner: req.user.id
		};

		game.rounds[game.round - 1].answers.push(formattedCard);

		const playerIndex = game.players?.findIndex(player => player._id === req.user.id);
		game.players[playerIndex].pickedCard = formattedCard;
		game.players[playerIndex].cards = game.players[playerIndex].cards?.filter(card => card._id !== cardId);

		// check if the user is the last one to pick a card, which means the round is over
		const players = game.players?.filter(player => player.cardCzar === false);
		const allPlayersPicked = players.every(player => player.pickedCard);
		if(allPlayersPicked){
			// update game status
			game.rounds[game.round - 1].status = 'czar_choosing_winner';
		}

		// update game in database
		await game.save();

		// announce that this players card has been picked
		Websocket.sendCardPicked(gameCode, req.user);
		// send what card the user picked to the card czar
		Websocket.sendCardCzarCard(gameCode, round.cardCzar, {
			userId: req.user.id,
			card
		});

		if(allPlayersPicked){
			// tell everyone that the round is over
			Websocket.sendRoundEnd(gameCode, {
				round: game.round,
				questionCard: round.questionCard,
				cardCzar: round.cardCzar,
				answers: round.answers?.map(answer => ({
					...answer._doc,
					id: answer._id,
					owner: answer.owner,
					text: answer.text,
					deck: answer.deck
				}))
			});
		}

		console.log(`[GAME] ${req.user.id} picked answer card ${cardId} for ${gameCode}`);

		return res.status(200).json({
			success: true,
			card
		});
	} catch(err){
		return next(err);
	}
};

const pickWinner = async (req, res, next) => {
	try{
		const { gameCode } = req.params;
		const { userId } = req.body;

		assert(gameCode, 'Please provide a game code');
		assert(userId, 'Please pick a winner');

		const game = await findGame(gameCode);
		assert(game, 'Invalid game code!');

		// make sure the game has started
		assert(!['waiting_for_players', 'finished'].includes(game.status), 'Game has not started yet!');

		// make sure the user is in the game
		const player = game.players?.find(player => player._id === req.user.id);
		assert(player, 'You are not in this game!');

		const round = game.rounds[game.round - 1];
		// make sure we are allowed to pick a winner
		assert(round.cardCzar === req.user.id, 'You are not the card czar!');
		assert(round.status === 'czar_choosing_winner', 'You can\'t pick a winner right now!');
		assert(req.user.id !== userId, 'You can\'t pick yourself as a winner!');

		// make sure the user they picked is a valid player
		const winner = game.players?.find(player => player._id === userId);
		assert(winner, 'The person you picked is not in the game!');

		// make sure the user has not already picked a winner
		assert(!round.winner, 'You have already picked a winner!');

		// set round status
		game.rounds[game.round - 1].status = 'finished';

		// pick the winner
		game.rounds[game.round - 1].winner = winner._id;
		game.rounds[game.round - 1].winningCard = game.rounds[game.round - 1].answers?.find(answer => answer.owner === winner._id);

		// increment the winner's score
		const winnerIndex = game.players?.findIndex(player => player._id === winner._id);
		game.players[winnerIndex].points++;

		// update game in database
		await game.save();

		// tell everyone what card was picked
		Websocket.sendRoundWinnerPicked(gameCode, {
			round: game.round,
			winner: winner._id,
			winningCard: game.rounds[game.round - 1].winningCard._doc
		});

		// check if the game is over
		if(game.gameLength === game.round){
			// update game status
			game.status = 'finished';

			// update game in database
			await game.save();

			// tell everyone the game is over
			Websocket.sendGameEnd(gameCode, {
				rounds: game.rounds.map(round => ({
					round: round.round,
					cardCzar: round.cardCzar,
					questionCard: round.questionCard,
					winner: round.winner,
					winningCard: round.winningCard,
					answers: round.answers.map(answer => ({
						id: answer._id,
						owner: answer.owner,
						text: answer.text,
						deck: answer.deck
					}))
				})),
				players: game.players?.map(player => ({
					id: player._id,
					name: player.name,
					points: player.points
				})),
				winner: game.players?.find(player => player.points === game.players?.reduce((max, player) => Math.max(max, player.points), 0))
			});
		}

		console.log(`[GAME] ${req.user.id} picked a winner ${userId} for game ${gameCode}`);

		return res.status(200).json({
			success: true,
			winner
		});
	} catch(err){
		return next(err);
	}
};

module.exports = {
	joinGame,
	createGame,
	pickCard,
	fetchGame,
	startGame,
	pickWinner
};