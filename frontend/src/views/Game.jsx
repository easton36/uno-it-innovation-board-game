import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';

const Game = ({ activeGame, setActiveGame, user }) => {
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

	return (
		<>
			<Grid item container direction="column" justifyContent="center" alignItems="center" minHeight="70vh">
				<Typography component="h1" variant="h3">
					Game
				</Typography>
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

export default Game;