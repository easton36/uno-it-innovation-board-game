import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import io from 'socket.io-client';

const socket = io('http://localhost:3001');
const theme = createTheme();

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  	useEffect(() => {
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
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box sx={{
				marginTop: 8,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			  }}>
					<Typography component="h1" variant="h3">
						Join Game
					</Typography>
					<Box component="form" noValidate sx={{ mt: 1 }}>
						<TextField margin="normal" required fullWidth id="code" label="Game code" name="gameCode"
							autoFocus />

						<Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
							Join Game
						</Button>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default App
