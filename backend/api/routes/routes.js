const express = require('express');
const queue = require('express-queue');
const router = express.Router();

const passport = require('../middlewear/passport.middlewear');

const { initializeUser } = require('./controllers/user.controller');
const { joinGame, createGame, pickCard, fetchGame, startGame, pickWinner } = require('./controllers/game.controller');

router.get('/user', initializeUser); // /api/user - initialize user

router.post('/game/create', passport.authenticate('jwt', { session: false, failWithError: true }), createGame); // /api/game/create - create a new game
router.post('/game/join', passport.authenticate('jwt', { session: false, failWithError: true }), joinGame); // /api/game/join - join game

router.get('/game/:gameCode', passport.authenticate('jwt', { session: false, failWithError: true }), fetchGame); // /api/game/:gameCode - fetch game
router.post('/game/:gameCode/start', passport.authenticate('jwt', { session: false, failWithError: true }), startGame); // /api/game/start - start game

// we don't want to two users to pick a card at the same time! This would be incredibly
// inefficient on a production level webapp, but it's fine for this small project.
const pickingCardQueue = queue({ activeLimit: 1, queuedLimit: -1 });

router.post('/game/:gameCode/pick-card', [ // /api/game/:gameCode/pick-card - pick a card
	passport.authenticate('jwt', { session: false, failWithError: true }),
	pickingCardQueue
], pickCard);

router.post('/game/:gameCode/pick-winner', passport.authenticate('jwt', { session: false, failWithError: true }), pickWinner); // /api/game/:gameCode/pick-winner - pick a winner

module.exports = router;