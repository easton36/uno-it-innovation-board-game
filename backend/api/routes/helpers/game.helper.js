const { findGame } = require('./queries.helper');

const answerDeck = require('../../../data/answerDeck.json');
const questionBaseDeck = require('../../../data/questionBaseDeck.json');

const CODE_LENGTH = 6;
const CODE_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

const generateGameCode = () => {
	let result = '';

	for(let i = 0; i < CODE_LENGTH; i++){
		result += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
	}

	return result;
};

const USER_CARD_AMOUNT = 10;

const pickUserCards = (userIds) => {
	const deck = [...answerDeck];

	// shuffle the deck
	for(let i = deck.length - 1; i > 0; i--){
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}

	// pick the cards for each user, users can't have the same card
	const userCards = {};
	for(const userId of userIds){
		userCards[userId] = deck.splice(0, USER_CARD_AMOUNT).map(card => ({
			_id: card._id,
			text: card.text,
			deck: card.deck,
			owner: userId
		}));
	}

	return userCards;
};

// match the deck name to the deck data
const getQuestionDeckCards = (deck) => {
	switch(deck.toLowerCase()){
	case 'base':
		return questionBaseDeck;
	default:
		return questionBaseDeck;
	}
};

const getAnswerDeckCards = (deck) => {
	switch(deck.toLowerCase()){
	case 'base':
		return answerDeck;
	default:
		return answerDeck;
	}
};

const pickQuestionCard = (previousCards, deck = 'base') => {
	const deckCards = getQuestionDeckCards(deck);
	// remove the previous cards from the deck
	const filteredDeckCards = [...deckCards].filter(card => previousCards.findIndex(prevCard => prevCard?._id === card?._id) === -1);

	// pick a random card from the deck
	return filteredDeckCards[Math.floor(Math.random() * filteredDeckCards.length)];
};

const mapGamePlayers = (player) => ({
	id: player._id,
	name: player.name,
	points: player.points,
	cardCzar: player.cardCzar,
	pickedCard: player.pickedCard === 'object'
});

const initiateNextRound = async (gameCode) => {
	const game = await findGame(gameCode);

	const newRound = {
		round: game.round + 1,
		status: 'players_choosing_cards'
	};

	// pick the card czar for this round, we move in a circle so just iterate through the players array from round number
	newRound.cardCzar = game.players[game.round % game.players?.length];
	// pick a black card for this round
	newRound.questionCard = pickQuestionCard(game.previousQuestionCards);

	// update black cards
	game.previousQuestionCards.push(game.questionCard);

	// pick cards for each player, minus the card czar
	const playerRoundCards = pickUserCards(game.players.filter(player => player._id !== newRound.cardCzar?._id).map(player => player._id));

	// add the cards to the players
	for(const player of game.players){
		if(player._id === newRound.cardCzar?._id){
			player.cards = [];
			player.cardCzar = true;
		} else{
			player.cards = playerRoundCards[player._id];
			player.cardCzar = false;
		}

		player.pickedCard = null;
	}

	// set game status to in progress if this is the first round
	if(game.round === 0){
		game.status = 'in_progress';
	}

	game.round++;
	game.rounds.push(newRound);

	// save the game to the database
	await game.save();

	return {
		round: game.round,
		newRound: game.rounds[game.round - 1],
		questionCard: newRound.questionCard,
		cardCzar: newRound.cardCzar,
		playerRoundCards,
		previousQuestionCards: game.previousQuestionCards
	};
};

const validateQuestionCard = (cardId, deck = 'base') => {
	const deckCards = getQuestionDeckCards(deck);

	return deckCards.find(card => card._id === cardId);
};

const validateAnswerCard = (cardId, deck = 'base') => {
	const deckCards = getAnswerDeckCards(deck);

	return deckCards.find(card => card._id === cardId);
};

module.exports = {
	generateGameCode,
	initiateNextRound,
	mapGamePlayers,
	validateQuestionCard,
	validateAnswerCard
};