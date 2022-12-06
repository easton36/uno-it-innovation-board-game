// used to standardize and reference how the game data will look to the client

const clientGameFormat = {
	id: 'string', // the game id
	code: 'string', // the game code
	status: 'string', // current game status. can be 'waiting_for_players', 'in_progress', 'finished'
	creator: 'string', // the user id of the game creator
	players: [
		{
			id: 'string', // the user id
			name: 'string', // the user name
			points: 'number', // the user points
			cardCzar: 'boolean', // whether or not the user is the card czar
			pickedCard: 'boolean' || { // the card the user picked
				id: 'string', // the card id
				text: 'string' // the card text
			} // whether or not the user has picked a card, will be object when cards are revealed
		}
	], // the users of the players in the game
	round: 'number', // the current round
	cardCzar: 'string', // the user id of the card czar
	deck: 'string', // the name of the card deck
	questionCard: {
		text: 'string' // the text of the black card
	} // the black card
};