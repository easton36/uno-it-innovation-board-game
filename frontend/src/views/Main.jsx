import { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';

const App = ({ activeGame, initiateUser, sessionToken }) => {
	const [name, setName] = useState('');

	return (
		<Grid item container direction="column" justifyContent="center" alignItems="center" minHeight="70vh">
			<Typography component="h1" variant="h3">
				Cards Against Humanity
			</Typography>
			{sessionToken ? (
				<Box noValidate sx={{
					mt: 1,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: 2,
				}}>
					{activeGame ? (
						<>
							<Link to="/game">
								<Button type="submit" variant="contained" sx={{ mt: 2, py: 2, width: 250, fontSize: 16 }}>
									Resume Active Game
								</Button>
							</Link>
						</>
					) : (
						<>
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
						</>
					)}
				</Box>
			) : (
				<Box sx={{ mt: 1 }}>
					<TextField margin="normal" required fullWidth id="name" label="Name" name="name" autoFocus value={name} onChange={(e) => {
						setName(e.target.value);
					}} />

					<Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25 }} onClick={() => initiateUser(name)}>
						Set Name
					</Button>
				</Box>
			)}
		</Grid>
	);
}

export default App;
