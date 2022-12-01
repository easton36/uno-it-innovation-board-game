import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Snackbar from '@mui/material/Snackbar';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import { CREATE_GAME } from '../api/fetch';

const CreateGame = () => {
	const [toast, setToast] = useState({
		open: false,
		message: '',
		severity: 'success'
	});

	const [gameLength, setGameLength] = useState('');
	const [gameDeck, setGameDeck] = useState('');

	const openToast = (type, message) => {
		setToast({
			open: true,
			message: message,
			severity: type
		});
	}

	const createGame = async () => {
		if(![5, 10, 15].includes(gameLength)){
			return openToast('error', 'Please select a valid game length');
		}
		if(!['all', 'cybersecurity', 'bioinformatics',].includes(gameDeck)){
			return openToast('error', 'Please select a valid game deck');
		}

		const response = await CREATE_GAME(gameLength, gameDeck);

		console.log(response);

		if(!response.success){
			return openToast('error', response.message || 'An error occurred');
		}

		openToast('success', 'Game created successfully');
		alert(JSON.stringify(response));
	};


	return (
		<Grid item container direction="column" justifyContent="center" alignItems="center" minHeight="70vh">
			<Typography component="h1" variant="h3">
				Create Game
			</Typography>

			<Box sx={{ mt: 5 }}>
				<Box component="div" sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 2,
				}}>
					<FormControl sx={{ width: 250 }}>
						<InputLabel id="total-round-select-label">Total Rounds</InputLabel>
						<Select labelId="total-round-select-label" id="total-round-select" value={gameLength} label="Total Rounds"
							onChange={(e) => {
								setGameLength(e.target.value);
							}}>
							<MenuItem value={5}>Five</MenuItem>
							<MenuItem value={10}>Ten</MenuItem>
							<MenuItem value={15}>Fifteen</MenuItem>
						</Select>
					</FormControl>

					<FormControl sx={{ width: 250 }}>
						<InputLabel id="deck-select-label">Deck</InputLabel>
						<Select labelId="deck-select-label" id="deck-select" value={gameDeck} label="Deck"
							onChange={(e) => {
								setGameDeck(e.target.value);
							}}>
							<MenuItem value={'all'}>All</MenuItem>
							<MenuItem value={'cybersecurity'}>Cybersecurity</MenuItem>
							<MenuItem value={'bioinformatics'}>Bioinformatics</MenuItem>
						</Select>
					</FormControl>
				</Box>

				<Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25 }} onClick={createGame}>
					Create Game
				</Button>

				<Link to="/">
					<Button variant="text" color="primary" startIcon={<ArrowBackIcon />} sx={{ mt: 1 }}>Go Back</Button>
				</Link>
			</Box>

			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				message={toast.message}
				severity={toast.severity}
			>

			</Snackbar>
		</Grid>
	);
}

export default CreateGame;
