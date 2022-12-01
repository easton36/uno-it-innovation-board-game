const mongoose = require('mongoose');

const Card = new mongoose.Schema({
	deck: { // black or white
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	}
});

const Player = new mongoose.Schema({
	_id: { // user id
		type: String,
		required: true
	},
	points: {
		type: Number,
		default: 0
	},
	answers: {
		type: [Card],
		default: []
	},
	cards: {
		type: [Card],
		default: []
	}
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
	players: [Player]
}, {
	timestamps: true
}));