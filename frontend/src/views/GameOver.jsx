import { useState, useMemo, useEffect } from 'react';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import GameNav from '../components/GameNav';
import GameModal from '../components/GameModal';

const GameOver = ({ activeGame, players: playersProp }) => {
	const [players, setPlayers] = useState(playersProp);
	const [modalOpen, setModalOpen] = useState(false);

	const toggleModal = () => {
		setModalOpen(prev => !prev);
	};

	useEffect(() => {
		setPlayers(playersProp);
	}, [playersProp]);

	const playersSorted = useMemo(() => {
		/* return [
			{
				name: 'Player 1',
				points: 60
			},
			{
				name: 'Player 2',
				points: 40
			},
			{
				name: 'Player 3',
				points: 20
			},
			{
				name: 'Player 4',
				points: 10
			},
			{
				name: 'Player 5',
				points: 5
			},
			{
				name: 'Player 6',
				points: 0
			},
			{
				name: 'Player 7',
				points: 0
			},
		]; */
		return players.sort((a, b) => b.points - a.points);
	}, [players]);

	return (
		<div className="gameOver w-full h-full bg-mainBg">
			<GameNav activeGame={activeGame} status="Game Over!" toggleModal={toggleModal}/>

			<div className="content leaderboard-wrapper flex flex-col w-full h-full items-center justify-end">
				<div className="leaderboard h-2/3 flex flex-row items-end gap-4">
					<div className="w-1/3 bg-primary rounded-t-lg z-10 px-8 py-5 flex flex-col items-center" style={{ height: '50%' }}>
						<p className="text-18 font-semibold text-white whitespace-nowrap">{playersSorted[2]?.name}</p>
						<p className="text-14 font-normal text-white whitespace-nowrap">{playersSorted[2]?.points} points</p>

						<div className="w-full h-full grow flex flex-col justify-center items-center">
							<div className="rounded-full w-20 h-20 flex flex-col items-center justify-center" style={{
								backgroundColor: "#CD7F32",
								border: "5px solid #a7682a"
							}}>
								<p className="font-bold text-20">3rd</p>
							</div>
						</div>
					</div>

					<div className="w-1/3 h-full bg-primary rounded-t-lg z-10 px-8 py-5 flex flex-col items-center">
						<p className="text-18 font-semibold text-white whitespace-nowrap">{playersSorted[0]?.name}</p>
						<p className="text-14 font-normal text-white whitespace-nowrap">{playersSorted[0]?.points} points</p>

						<div className="w-full h-full grow flex flex-col justify-center items-center">
							<div className="rounded-full w-28 h-28 flex flex-col items-center justify-center" style={{
								backgroundColor: "#FFD700",
								border: "5px solid #c1a50c"
							}}>
								<p className="font-bold text-20">1st</p>
							</div>
						</div>
					</div>

					<div className="w-1/3 bg-primary rounded-t-lg z-10 px-8 py-5 flex flex-col items-center" style={{ height: '75%' }}>
						<p className="text-18 font-semibold text-white whitespace-nowrap">{playersSorted[1]?.name}</p>
						<p className="text-14 font-normal text-white whitespace-nowrap">{playersSorted[1]?.points} points</p>

						<div className="w-full h-full grow flex flex-col justify-center items-center">
							<div className="rounded-full w-24 h-24 flex flex-col items-center justify-center" style={{
								backgroundColor: "#C0C0C0",
								border: "5px solid #949494"
							}}>
								<p className="font-bold text-20">2nd</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="bottom w-full h-56 bg-secondaryBg">
				<div className="flex flex-row items-center md:justify-center gap-2 h-full">
					{[...playersSorted].slice(3).map((player, index) => (
						<div className="bg-mainBg px-16 py-6 rounded-lg flex flex-col items-center" key={index}>
							<p className="font-semibold text-18 text-white">{player.name}</p>
							<p className="text-14 text-white">{player.points} points</p>
						</div>
					))}
				</div>
			</div>

			<Modal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="absolute bg-navBg rounded-lg flex flex-col relative overflow-hidden py-6 px-3" sx={{
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400
				}}>
					<GameModal rounds={activeGame?.rounds} game={activeGame} players={players}/>
				</Box>
			</Modal>
		</div>
	);
}

export default GameOver;