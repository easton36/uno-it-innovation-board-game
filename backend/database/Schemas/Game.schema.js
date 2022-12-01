const mongoose = require('mongoose');

const Card = new mongoose.Schema({
	deck: { // black or white
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	owner: { // sometimes cards are owned by a user
		type: String,
		required: false
	}
});

const Player = new mongoose.Schema({
	_id: { // user id
		type: String,
		required: true
	},
	cardCzar: { // is this player the card czar
		type: Boolean,
		required: true,
		default: false
	},
	points: {
		type: Number,
		default: 0
	},
	answer: {
		type: Card,
		default: null
	},
	cards: {
		type: [Card],
		default: []
	}
});

const Round = new mongoose.Schema({
	status: {
		type: String,
		default: 'czar_choosing_card', // current round status. can be 'czar_choosing_card', 'players_choosing_cards', 'czar_choosing_winner', 'finished'
		required: true
	},
	cardCzar: { // user id of card czar for this round
		type: String,
		required: true,
		default: null
	},
	currentRound: { // current round number
		type: Number,
		default: 0,
		required: true
	},
	blackCard: {
		type: Card,
		required: true,
		default: null
	},
	winner: { // user id of winner
		type: String,
		default: null
	},
	answers: { // answers for this round
		type: [Card],
		default: []
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Game', new mongoose.Schema({
	_id: { // this is the game code
		type: String,
		required: true
	},
	status: { // current game status. can be 'waiting_for_players', 'in_progress', 'finished'
		type: String,
		required: true,
		default: 'waiting_for_players'
	},
	round: { // current round number
		type: Number,
		default: 0,
		required: true
	},
	deck: {
		type: String,
		required: true
	},
	creator: { // user id of the creator
		type: String,
		required: true
	},
	gameLength: { // max number of rounds
		type: Number,
		required: true
	},
	players: [Player],
	rounds: [Round],
	previousBlackCards: { // previous black cards
		type: [Card],
		default: [],
		required: true
	}
}, {
	timestamps: true
}));