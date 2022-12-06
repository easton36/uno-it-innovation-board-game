import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { JOIN_GAME } from '../api/fetch';

const JoinGame = ({ gameJoined }) => {
	const navigate = useNavigate();

	const [toast, setToast] = useState({
		open: false,
		message: '',
		severity: 'success'
	});

	const openToast = (type, message) => {
		setToast({
			open: true,
			message: message,
			severity: type
		});
	};

	const [gameCode, setGameCode] = useState('');

	const joinGame = async () => {
		const response = await JOIN_GAME(gameCode);

		if(!response.success){
			return openToast('error', response.message || 'An error occurred');
		}

		gameJoined(response.data);

		setGameCode('');

		openToast('success', 'Game joined successfully');

		return navigate(`/game`);
	};

	return (
		<>
			<Grid item container direction="column" justifyContent="center" alignItems="center" minHeight="70vh">
				<Typography component="h1" variant="h3">
					Join Game
				</Typography>
				<Box sx={{ mt: 1 }}>
					<TextField margin="normal" required fullWidth id="code" label="Game code" name="gameCode" autoFocus value={gameCode} onChange={(e) => {
						setGameCode(e.target.value);
					}} />

					<Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25 }} onClick={joinGame}>
						Join Game
					</Button>

					<Link to="/">
						<Button variant="text" color="primary" startIcon={<ArrowBackIcon />} sx={{ mt: 1 }}>Go Back</Button>
					</Link>
				</Box>
			</Grid>

			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				message={toast.message}
				severity={toast.severity}
			/>
		</>
	);
}

export default JoinGame;
