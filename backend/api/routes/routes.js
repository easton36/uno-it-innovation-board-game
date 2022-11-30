const express = require('express');
const router = express.Router();

const passport = require('../middlewear/passport.middlewear');

const { joinGame, createGame, pickCard } = require('./controllers/game.controller');

router.post('/game/create', createGame); // /api/game/create - create a new game
router.post('/game/join', joinGame); // /api/game/join - join game

// protected routes
router.post('/game/:gameCode/pick-card', passport.authenticate('jwt', { session: false, failWithError: true }), pickCard); // /api/game/:gameCode/pick-card - pick a card

module.exports = router;