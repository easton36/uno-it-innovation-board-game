const express = require('express');
const router = express.Router();

const passport = require('../middlewear/passport.middlewear');

const { initializeUser } = require('./controllers/user.controller');
const { joinGame, createGame, pickCard, fetchGame, startGame } = require('./controllers/game.controller');

router.get('/user', initializeUser); // /api/user - initialize user

router.post('/game/create', passport.authenticate('jwt', { session: false, failWithError: true }), createGame); // /api/game/create - create a new game
router.post('/game/join', passport.authenticate('jwt', { session: false, failWithError: true }), joinGame); // /api/game/join - join game

router.get('/game/:gameCode', passport.authenticate('jwt', { session: false, failWithError: true }), fetchGame); // /api/game/:gameCode - fetch game
router.post('/game/:gameCode/start', passport.authenticate('jwt', { session: false, failWithError: true }), startGame); // /api/game/start - start game
router.post('/game/:gameCode/pick-card', passport.authenticate('jwt', { session: false, failWithError: true }), pickCard); // /api/game/:gameCode/pick-card - pick a card

module.exports = router;