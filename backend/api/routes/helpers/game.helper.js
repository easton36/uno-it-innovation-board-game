const whiteDeck = require('../../../data/whiteDeck.json');
const blackDeck = require('../../../data/blackDeck.json');

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
	const deck = [...whiteDeck];

	// shuffle the deck
	for(let i = deck.length - 1; i > 0; i--){
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}

	// pick the cards for each user, users can't have the same card
	const userCards = {};
	for(const userId of userIds){
		userCards[userId] = deck.splice(0, USER_CARD_AMOUNT);
	}

	return userCards;
};

const pickBlackCard = (previousCards) => {
	// remove the previous cards from the deck
	const deck = [...blackDeck].filter(card => previousCards.findIndex(prevCard => prevCard.text === card.text) === -1);

	// pick a random card from the deck
	return deck[Math.floor(Math.random() * deck.length)];
};

module.exports = {
	generateGameCode,
	pickUserCards,
	pickBlackCard
};