import { useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from 'js-cookie';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CustomBrowserRouter, customHistory } from "./components/CustomBrowserRouter";

import Main from './views/Main';
import Game from './views/Game';
import GameOver from './views/GameOver';

import io from 'socket.io-client';

import { INITIATE_USER, FETCH_GAME_INFO } from './api/fetch';

const theme = createTheme({
	palette: {
		gray: {
			main: '#f5f5f5',
			darker: '#e0e0e0',
		},
		primary: {
			main: '#1475E1'
		},
		success: {
			main: '#00e701'
		}
	},
	typography: {
		button: {
			textTransform: 'none',
			fontWeight: '500'
		}
	}
});

const socket = io('https://game.easton.gg', {
	extraHeaders: {
		Authorization: `Bearer ${localStorage.getItem('token')}`
	}
});

const App = () => {
	const [user, setUser] = useState(null);
	const [activeGame, setActiveGame] = useState(null);
	const [players, setPlayers] = useState([]);
	const [gameFeed, setGameFeed] = useState([]);
	const [gameRound, setGameRound] = useState();
	const [questionCard, setQuestionCard] = useState();
	const [userCards, setUserCards] = useState([]);

	const sessionToken = useMemo(() => Cookies.get('token') || localStorage.getItem('token'), [user]);

	const initiateUser = async (name) => {
		if(!sessionToken && !name) return;

		const response = await INITIATE_USER(name);
	
		if(!response.success) return toast.error(response.message || 'An error has occurred');

		localStorage.setItem('token', response.token);
		setUser(response.userId);
	
		if(response?.activeGame){
			const gameData = await FETCH_GAME_INFO(response.activeGame);

			if(gameData?.data?.cardCzar === response.userId){
				setUserCards(gameData.data.answers);
			} else{
				setUserCards(gameData.data?.cards);
			}

			setGameRound({
				id: gameData.data?.id, // game code
				questionCard: gameData.data?.questionCard,
				cardCzar: gameData.data?.cardCzar,
				round: gameData.data?.round,
				players: gameData.data?.players,
				status: gameData.data?.roundStatus
			});
			setActiveGame(gameData.data);
			setQuestionCard(gameData.data?.questionCard);
			setPlayers(gameData.data?.players);
		}
	};

	const gameCreated = (data) => {
		setActiveGame(data);
		setPlayers(data.players);
	};

	const gameJoined = (data) => {
		setActiveGame(data);
		setPlayers(data.players);
	};

  	useEffect(() => {
		initiateUser();

		socket?.on('connect', () => {
			toast.success('Connected to the server!');
		});

		socket?.on('disconnect', () => {
			toast.error('You have been disconnected from the server!');
		});

		// user joined game
		socket?.on('game:user:join', (data) => {
			console.log('game:user:join', data);

			setPlayers(prev => [...prev, {
				...data,
				_id: data.userId,
				id: data.userId,
				name: data.name,
				points: 0
			}]);
			
			setGameFeed(prev => [...prev, {
				event: 'game:user:join',
				name: data.name,
				userId: data.userId,
				message: 'joined the game!',
				timestamp: Date.now()
			}]);
		});

		// user left game
		socket?.on('game:user:leave', (data) => {
			setGameFeed(prev => [...prev, {
				event: 'game:user:leave',
				name: data.name,
				userId: data.userId,
				message: 'left the game.',
				timestamp: Date.now()
			}]);

			console.log('game:user:leave', data);
		});

		// game round started
		socket?.on('game:round:start', (data) => {
			setGameFeed(prev => [...prev, {
				event: 'game:round:start',
				name: `Round ${data.round}`,
				questionCard: data.questionCard,
				message: 'has started!',
				timestamp: Date.now()
			}]);

			setGameFeed(prev => [...prev, {
				event: 'game:round:start',
				name: data.cardCzar,
				nameIsId: true,
				message: 'is the Card Czar!',
				timestamp: Date.now()
			}]);

			setQuestionCard(data.questionCard);
			setGameRound({
				...data,
				status: 'players_choosing_cards'
			});
			setActiveGame(prev => ({
				...prev,
				rounds: [...(prev.rounds || []), data],
				round: data.round
			}));

			console.log('game:round:start', data);
		});

		// new user cards received
		socket?.on('game:user:cards', (data) => {
			console.log('game:user:cards', data);

			setGameFeed(prev => [...prev, {
				event: 'game:user:cards',
				name: `Everyone`,
				cards: data.cards,
				message: 'has received new cards!',
				timestamp: Date.now()
			}]);

			setUserCards(data.cards);
		});

		// user picked card
		socket?.on('game:user:picked', (data) => {

			setGameFeed(prev => [...prev, {
				event: 'game:user:picked',
				name: `${data.name}`,
				message: 'picked their answer.',
				timestamp: Date.now(),
				userId: data.userId
			}]);

			console.log('game:user:picked', data);
		});

		// user picked card, card czar only
		socket?.on('game:round:card', (data) => {
			setUserCards(prev => [...prev, {
				...data.card,
				userId: data.userId,
				owner: data.userId
			}]);

			console.log('game:round:card', data);
		});

		// round ended
		socket?.on('game:round:end', (data) => {
			setGameRound(prev => ({
				...prev,
				status: 'czar_choosing_winner'
			}));

			setGameFeed(prev => [...prev, {
				event: 'round',
				message: 'The round has ended! All of the answers have been displayed. The Card Czar will now pick the winner!',
				timestamp: Date.now()
			}]);

			// append the answer data to the round data
			setGameRound(prev => ({
				...prev,
				status: 'finished'
			}));
			setActiveGame(prev => ({
				...prev,
				rounds: [...(prev.rounds || []), {
					...(prev.rounds || [])[prev.rounds?.length - 1],
					answers: data.answers
				}]
			}));

			setUserCards(data.answers);

			console.log('game:round:end', data);
		});

		// round winner picked
		socket?.on('game:round:winner', (data) => {
			setGameFeed(prev => [...prev, {
				event: 'game:round:winner',
				name: data.winner,
				nameIsId: true,
				message: 'is the round winner!',
				timestamp: Date.now()
			}]);

			setGameFeed(prev => [...prev, {
				event: 'game:round:winner',
				message: 'Waiting for the game creator to start the next round...',
				timestamp: Date.now()
			}]);

			// add points to the player that won
			setPlayers(prev => {
				const prevPlayers = [...prev];

				const winningPlayerIndex = prevPlayers.findIndex(player => player.id === data.winner);

				prevPlayers[winningPlayerIndex].points += data.points || 5;
				
				return prevPlayers;
			});

			// add the winning answer to the question card
			setQuestionCard(prev => ({
				...prev,
				text: prev?.text?.includes('BLANK') ? prev?.text.replace('BLANK', data.winningCard?.text?.replace('.', '')) : (prev?.text + ' ' + data.winningCard?.text?.replace('.', '')),
				winner: data.winner
			}));

			// append winnner data to the round data
			setGameRound(prev => ({
				...prev,
				status: 'finished'
			}));
			setActiveGame(prev => ({
				...prev,
				rounds: [...(prev.rounds || []), {
					...(prev.rounds || [])[prev.rounds?.length - 1],
					winner: data.winner,
					winningCard: data.winningCard,
					points: data.points,
					status: 'finished'
				}]
			}));

			console.log('game:round:winner', data);
		});

		// game ended
		socket?.on('game:end', (data) => {
			setGameFeed(prev => [...prev, {
				event: 'game:end',
				message: 'The game has ended!',
				timestamp: Date.now()
			}]);
			setGameFeed(prev => [...prev, {
				event: 'game:round:winner',
				name: data.winner,
				nameIsId: true,
				message: 'is the overall game winner!',
				timestamp: Date.now()
			}]);

			setTimeout(() => {
				//window.location.href = '/game-over';
				customHistory.push("/game-over");
			}, 1000);

			console.log('game:end', data);
		});

		return () => {
			socket?.off('connect');
			socket?.off('disconnect');
			socket?.off('game:user:join');
			socket?.off('game:user:leave');
			socket?.off('game:round:start');
			socket?.off('game:user:cards');
			socket?.off('game:user:picked');
			socket?.off('game:round:picked');
			socket?.off('game:round:end');
			socket?.off('game:round:winner');
			socket?.off('game:end');
			socket?.off('game:round:card');
		};
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<CustomBrowserRouter>
				<Routes>
					<Route path="/" element={<Main
						activeGame={activeGame}
						initiateUser={initiateUser}
						sessionToken={sessionToken}
						gameCreated={gameCreated}
						gameJoined={gameJoined}
					/>} />
					<Route path="/game" element={<Game 
						activeGame={activeGame}
						userCards={userCards}
						questionCard={questionCard}
						setActiveGame={setActiveGame}
						user={user}
						gameFeed={gameFeed}
						gameRound={gameRound}
						players={players}
					/>} />
					<Route path="/game-over" element={<GameOver
						activeGame={activeGame}
						players={players}
						user={user}
					/>} />
				</Routes>
			</CustomBrowserRouter>

			<ToastContainer 
			    position="bottom-right"
				theme="colored"
			/>
		</ThemeProvider>
	);
}

export default App;
