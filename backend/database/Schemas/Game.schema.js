const mongoose = require('mongoose');

const Player = new mongoose.Schema({
});

module.exports = mongoose.model('Game', new mongoose.Schema({
	_id: { // this is the game code
		type: String,
		required: true,
		index: true
	},
	deck: {
		type: String,
		required: true
	},
	players: [Player]
}, {
	timestamps: true
}));