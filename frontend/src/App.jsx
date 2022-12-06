import { useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Cookies from 'js-cookie';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Main from './views/Main';
import CreateGame from './views/CreateGame';
import JoinGame from './views/JoinGame';
import Game from './views/Game';

import io from 'socket.io-client';

import { INITIATE_USER, FETCH_GAME_INFO } from './api/fetch';

const theme = createTheme({
	palette: {
		gray: {
			main: '#f5f5f5',
			darker: '#e0e0e0',
		}
	}
});

const socket = io('http://localhost:3000', {
	extraHeaders: {
		Authorization: `Bearer ${localStorage.getItem('token')}`
	}
});

const App = () => {
  	const [isConnected, setIsConnected] = useState(socket?.connected);

	const [user, setUser] = useState(null);
	const [activeGame, setActiveGame] = useState(null);
	const [players, setPlayers] = useState([]);
	const [gameFeed, setGameFeed] = useState([]);
	const [gameRound, setGameRound] = useState();
	/* {
		name: '', // user name
		userId: '', // user id
		event: '', // websocket event
		message: '', // feed message
	} */
	const [questionCard, setQuestionCard] = useState();
	const [userCards, setUserCards] = useState([]);

	const sessionToken = useMemo(() => Cookies.get('token') || localStorage.getItem('token'), []);

	const initiateUser = async (name) => {
		if(!sessionToken && !name) return;

		const response = await INITIATE_USER(name);
	
		if(!response.success) return

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
			})
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
			setIsConnected(true);

			toast.success('Connected to the server!');
		});

		socket?.on('disconnect', () => {
			setIsConnected(false);

			toast.error('You have been disconnected from the server!');
		});

		// user joined game
		socket?.on('game:user:join', (data) => {
			console.log('game:user:join', data);

			setPlayers(prev => [...prev, {
				...data,
				_id: data.userId,
				id: data.userId,
				name: data.name
			}]);
			
			setGameFeed(prev => [...prev, {
				event: 'game:user:join',
				name: data.name,
				userId: data.userId,
				message: 'joined the game!',
			}]);
		});

		// user left game
		socket?.on('game:user:leave', (data) => {
			setGameFeed(prev => [...prev, {
				event: 'game:user:leave',
				name: data.name,
				userId: data.userId,
				message: 'left the game.',
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
			}]);

			setGameFeed(prev => [...prev, {
				event: 'game:round:start',
				name: data.cardCzar,
				nameIsId: true,
				message: 'is the Card Czar!',
			}]);

			setQuestionCard(data.questionCard);
			setGameRound({
				...data,
				status: 'players_choosing_cards'
			});

			setActiveGame(prev => ({
				...prev,
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
			}]);

			setUserCards(data.cards);
		});

		// user picked card
		socket?.on('game:user:picked', (data) => {

			setGameFeed(prev => [...prev, {
				event: 'game:user:picked',
				name: `${data.name}`,
				message: 'picked their answer.',
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
			}]);

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
			}]);

			setQuestionCard(prev => ({
				...prev,
				text: prev?.text?.includes('BLANK') ? prev?.text.replace('BLANK', data.winningCard?.text) : (prev?.text + ' ' + data.winningCard?.text),
				winner: data.winner
			}));

			setGameRound(prev => ({
				...prev,
				status: 'finished'
			}));

			console.log('game:round:winner', data);
		});

		// game ended
		socket?.on('game:end', (data) => {
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
			<Router>
				<Routes>
					<Route path="/" element={<Main activeGame={activeGame} initiateUser={initiateUser} sessionToken={sessionToken} />} />
					<Route path="/create-game" element={<CreateGame gameCreated={gameCreated} />} />
					<Route path="/join-game" element={<JoinGame gameJoined={gameJoined} />} />
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
				</Routes>
			</Router>

			<ToastContainer 
			    position="bottom-right"
				theme="colored"
			/>
		</ThemeProvider>
	);
}

export default App;
