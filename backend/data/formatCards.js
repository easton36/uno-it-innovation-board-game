const { v4: uuid } = require('uuid');
const fs = require('fs');

const blackDeck = require('./blackDeck.json');
const whiteDeck = require('./whiteDeck.json');

// add uuid to each card
const addUuid = (cards) => {
	return cards.map((card) => ({
		...card,
		_id: uuid()
	}));
};

// save cards to file
const saveCards = (cards, fileName) => {
	fs.writeFile(`./${fileName}.json`, JSON.stringify(cards), (err) => {
		if(err){
			console.log(err);
		}
	});
};

saveCards(addUuid(blackDeck), 'blackDeck');
saveCards(addUuid(whiteDeck), 'whiteDeck');