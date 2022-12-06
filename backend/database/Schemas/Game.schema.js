const mongoose = require('mongoose');

const Card = new mongoose.Schema({
	_id: { // card id
		type: String,
		required: true
	},
	deck: { // The deck the card belongs to
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	owner: { // sometimes cards are owned by a user, this is the user id
		type: String,
		required: false
	}
});

const Player = new mongoose.Schema({
	_id: { // user id
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	status: { // player status, can be 'playing', 'disconnected'
		type: String,
		required: true,
		default: 'playing'
	},
	cardCzar: { // is this player the card czar
		type: Boolean,
		required: true,
		default: false
	},
	points: { // the player points
		type: Number,
		default: 0
	},
	pickedCard: { // the card the user picked for this round
		type: Card,
		default: null
	},
	cards: { // what cards the user has for this round
		type: [Card],
		default: []
	}
});

const Round = new mongoose.Schema({
	status: {
		type: String,
		default: 'players_choosing_cards', // current round status. can be 'players_choosing_cards', 'czar_choosing_winner', 'finished'
		required: true
	},
	cardCzar: { // user id of card czar for this round
		type: String,
		required: true,
		default: null
	},
	round: { // current round number
		type: Number,
		required: true
	},
	questionCard: {
		type: Card,
		required: true,
		default: null
	},
	winner: { // user id of winner
		type: String,
		default: null
	},
	winningCard: { // the card that won
		type: Card,
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
	code: { // this is the game code
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
		required: true,
		default: 'base'
	},
	creator: { // user id of the creator
		type: String,
		required: true
	},
	gameLength: { // max number of rounds
		type: Number,
		required: true
	},
	players: {
		type: [Player],
		default: []
	},
	rounds: {
		type: [Round],
		default: []
	},
	previousQuestionCards: { // previous black cards
		type: [Card],
		default: [],
		required: true
	}
}, {
	timestamps: true
}));