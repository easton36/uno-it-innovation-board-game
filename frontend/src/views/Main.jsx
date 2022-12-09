import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import { TextField, InputLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormControl, Select, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';

import { CREATE_GAME, JOIN_GAME } from '../api/fetch';

const App = ({ activeGame, initiateUser, sessionToken, gameCreated, gameJoined }) => {
	const navigate = useNavigate();

	const [authenticated, setAuthenticated] = useState(sessionToken);
	const [name, setName] = useState('');
	const [page, setPage] = useState('main');

	useEffect(() => {
		setAuthenticated(sessionToken);
	}, [sessionToken]);

	/* const subTitle = useMemo(() => {
		if(!authenticated) return 'Please set your username to continue';

		switch(page){
			case 'main':
				return 'Select an option to enter a game';
			case 'create-game':
				return 'Create a game and play with your friends!';
		}
	}, [page, authenticated]); */

	const postName = () => {
		initiateUser(name);

		setName('');
	};

	const [gameLength, setGameLength] = useState('');
	const [gameDeck, setGameDeck] = useState('');

	const createGame = async () => {
		if(![5, 10, 15].includes(gameLength)){
			return toast.error('Please select a valid game length');
		}
		if(!['base', 'cybersecurity', 'bioinformatics',].includes(gameDeck)){
			return toast.error('Please select a valid game deck');
		}

		const response = await CREATE_GAME(gameLength, gameDeck);

		if(!response.success){
			return toast.error(response.message || 'An error occurred');
		}

		gameCreated(response.data);

		setGameLength('');
		setGameDeck('');

		toast.success('Game created successfully');

		return navigate(`/game`);
	};

	const [gameCode, setGameCode] = useState('');

	const joinGame = async () => {
		if(!gameCode || gameCode.length !== 6){
			return toast.error('Invalid game code');
		}

		const response = await JOIN_GAME(gameCode);

		if(!response.success){
			return toast.error(response.message || 'An error occurred');
		}

		gameJoined(response.data);

		setGameCode('');

		toast.success('Game joined successfully');

		return navigate(`/game`);
	};

	return (
		<div className="w-full h-full flex flex-col items-center justify-center bg-mainBg">
			<div className="max-w-4xl grid grid-cols-2 bg-white rounded-12 mt-10" style={{
				boxShadow: '0 0 40px #161616',
				transform: 'translateY(-5%)'
			}}>
				<div className="h-full bg-primary rounded-tl-12 rounded-bl-12 px-12 py-12 flex-1 flex flex-col items-center justify-center" style={{
					height: 'calc(100% + 2px)',
					marginTop: '-1px'
				}}>
					<p className="font-semibold text-16 text-white mb-4">How to Play:</p>
					<div className="flex flex-row items-start mb-2">
						<p className="font-bold text-14 text-white pr-2">1.</p>
						<p className="text-12 text-white leading-relaxed">When the game/round starts, a black question card will be drawn. A player will be given the job of "Card Czar" which will choose the best answer.</p>
					</div>
					<div className="flex flex-row items-start mb-2">
						<p className="font-bold text-14 text-white pr-2">2.</p>
						<p className="text-12 text-white leading-relaxed">Each of the remaining (non-Card Czar) players will be given 10 cards from the answer deck. Each player will choose the card they think works best with the question card.</p>
					</div>
					<div className="flex flex-row items-start mb-2">
						<p className="font-bold text-14 text-white pr-2">3.</p>
						<p className="text-12 text-white leading-relaxed">Once all of the answers have been submitted, the Card Czar will choose the answer card they think works best. The player who submitted the selected card will then receive points for winning the round.</p>
					</div>
					<div className="flex flex-row items-start">
						<p className="font-bold text-14 text-white pr-2">4.</p>
						<p className="text-12 text-white leading-relaxed">Once all of the rounds have finished, the player who has the most points wins!</p>
					</div>
				</div>
				<div className="relative h-full bg-secondaryBg rounded-tr-12 rounded-br-12 px-12 py-12 flex flex-col items-center justify-center text-white" style={{
					height: 'calc(100% + 2px)',
					marginTop: '-1px'
				}}>
					<div className="absolute top-8 text-center w-full">
						<p className="mb-0 text-22 font-semibold">Cards Against Humanity</p>
						{/* <p className="-mt-1 text-14 font-normal">{subTitle}</p> */}
					</div>

					{page === 'main' && (
						authenticated ? (
							<>
								{activeGame ? (
									<>
										<div className="flex flex-col items-center">
											<p className="text-14 mb-2">You already are in an active game!</p>

											<Link to="/game">
												<Button variant="contained" sx={{ mt: 0, py: 2, width: 250, fontSize: 16}} color="primary">
													Resume Active Game
												</Button>
											</Link>
										</div>
									</>
								) : (
									<div className="flex flex-col items-center">
										<div className="flex flex-col items-center">
											<p className="text-14 mb-2">Create a game for others to join</p>
											<Button variant="contained" sx={{ width: 240, py: 2, fontSize: 16, mt: 0}} color="primary" onClick={() => setPage('create-game')}>
												Create Game
											</Button>
										</div>

										<p className="font-semibold text-16 mt-3 mb-3">OR</p>
										
										<div className="flex flex-col items-center">
											<p className="text-14 mb-2">Join an existing game</p>
											<Button fullWidth variant="contained" sx={{ width: 240, py: 2, fontSize: 16, mt: 0}} color="primary" onClick={() => setPage('join-game')}>
												Join Game
											</Button>
										</div>
									</div>
								)}
							</>
						) : (
							<>
								<p className="w-full mb-3 text-14">Please set your username to continue</p>
								<TextField margin="normal" required fullWidth id="name" label="Username" name="name" autoFocus value={name} onChange={(e) => {
									setName(e.target.value);
								}} sx={{ mt: 0 }} InputProps={{
									sx: { 
										color: 'white',
									}
								}}/>

								<Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25}} color="primary" onClick={() => postName()}>
									Set Username
								</Button>
							</>
						)
					)}

					{page === 'create-game' && (
						<div className="mt-6">
							<div className="flex flex-col gap-4">
								<FormControl>
									<InputLabel id="total-round-select-label" sx={{ color: 'white' }}>Total Rounds</InputLabel>
									<Select labelId="total-round-select-label" id="total-round-select" value={gameLength} label="Total Rounds" onChange={(e) => {
										setGameLength(e.target.value);
									}} sx={{
										color: 'white',
									}}>
										<MenuItem value={5}>Five</MenuItem>
										<MenuItem value={10}>Ten</MenuItem>
										<MenuItem value={15}>Fifteen</MenuItem>
									</Select>
								</FormControl>

								<FormControl>
									<InputLabel id="deck-select-label" sx={{ color: 'white' }}>Deck</InputLabel>
									<Select labelId="deck-select-label" id="deck-select" value={gameDeck} label="Deck" onChange={(e) => {
										setGameDeck(e.target.value);
									}} sx={{
										color: 'white',
									}}>
										<MenuItem value={'base'}>Base</MenuItem>
										<MenuItem value={'cybersecurity'}>Cybersecurity</MenuItem>
										<MenuItem value={'bioinformatics'}>Bioinformatics</MenuItem>
									</Select>
								</FormControl>
							</div>

							<Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25}} color="primary" onClick={createGame}>
								Create Game
							</Button>

							<Button variant="text" color="primary" startIcon={<ArrowBackIcon />} sx={{ mt: 1 }} onClick={() => setPage('main')}>Go Back</Button>
						</div>
					)}

					{page === 'join-game' && (
						<div>
							<TextField margin="normal" required fullWidth id="code" label="Game code" name="gameCode" autoFocus value={gameCode} onChange={(e) => {
								setGameCode(e.target.value);
							}} InputProps={{
								sx: { 
									color: 'white',
								}
							}} sx={{ color: 'white' }}/>

							<Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25 }} color="primary" onClick={joinGame}>
								Join Game
							</Button>

							<Button variant="text" color="primary" startIcon={<ArrowBackIcon />} sx={{ mt: 1 }} onClick={() => setPage('main')}>Go Back</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
