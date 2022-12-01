import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const JoinGame = () => {
	const [gameCode, setGameCode] = useState('');

	const joinGame = () => {

	};

	return (
		<Grid item container direction="column" justifyContent="center" alignItems="center" minHeight="70vh">
			<Typography component="h1" variant="h3">
				Join Game
			</Typography>
			<Box sx={{ mt: 1 }}>
				<TextField margin="normal" required fullWidth id="code" label="Game code" name="gameCode" autoFocus value={gameCode} onInput={(e) => {
					setGameCode(e.target.value);
				}} />

				<Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25 }}>
					Join Game
				</Button>

				<Link to="/">
					<Button variant="text" color="primary" startIcon={<ArrowBackIcon />} sx={{ mt: 1 }}>Go Back</Button>
				</Link>
			</Box>
		</Grid>
	);
}

export default JoinGame;
