import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from './views/Main';
import CreateGame from './views/CreateGame';
import JoinGame from './views/JoinGame';
import Game from './views/Game';

import io from 'socket.io-client';

import { INITIATE_USER } from './api/fetch';

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

	const initiateUser = async () => {
		const response = await INITIATE_USER();
	
		if(response.success){
			localStorage.setItem('token', response.token);
		}

		setUser(response.userId);
	
		if(response?.activeGame){
			setActiveGame(response.activeGame);
		}
	};

  	useEffect(() => {
		initiateUser();

		socket?.on('connect', () => {
			setIsConnected(true);
		});

		socket?.on('disconnect', () => {
			setIsConnected(false);
		});

		return () => {
			socket?.off('connect');
			socket?.off('disconnect');
		};
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Routes>
					<Route path="/" element={<Main activeGame={activeGame}/>} />
					<Route path="/create-game" element={<CreateGame setActiveGame={setActiveGame}/>} />
					<Route path="/join-game" element={<JoinGame setActiveGame={setActiveGame}/>} />
					<Route path="/game" element={<Game activeGame={activeGame} setActiveGame={setActiveGame} user={user}/>} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
