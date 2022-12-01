import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const App = ({ activeGame }) => {
	return (
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
		</Grid>
	);
}

export default App;
