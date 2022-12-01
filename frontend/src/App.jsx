import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { INITIATE_USER } from './api/fetch';

import io from 'socket.io-client';

const socket = io('http://localhost:3000');
const theme = createTheme({
	palette: {
		gray: {
			main: '#f5f5f5',
			darker: '#e0e0e0',
		}
	}
});

const App = () => {
  	const [isConnected, setIsConnected] = useState(socket.connected);

	const initiateUser = async () => {
		const response = await INITIATE_USER();

		if(response.success){
			localStorage.setItem('token', response.token);
		}
	};

  	useEffect(() => {
		initiateUser();

		socket.on('connect', () => {
			setIsConnected(true);
		});

		socket.on('disconnect', () => {
			setIsConnected(false);
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
		};
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Grid item container direction="column" justifyContent="center" alignItems="center" minHeight="70vh">
				<Typography component="h1" variant="h3">
					Cards Against Humanity
				</Typography>
				<Box noValidate sx={{
					mt: 1,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: 2,
				}}>
					<Link to="/create-game">
						<Button type="submit" variant="contained" sx={{ mt: 2, py: 2, width: 180, fontSize: 16 }}>
							Create Game
						</Button>
					</Link>
					
					<Link to="/join-game">
						<Button type="submit" variant="contained" sx={{ mt: 2, py: 2, width: 180, fontSize: 16 }}>
							Join Game
						</Button>
					</Link>
				</Box>
			</Grid>
		</ThemeProvider>
	);
}

export default App;
