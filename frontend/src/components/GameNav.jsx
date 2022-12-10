import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';

import  { START_ROUND } from '../api/fetch';

const GameNav = ({ activeGame, isCreator, toggleModal, status }) => {
	const [round, setRound] = useState(activeGame?.round);
	const [gameCode, setGameCode] = useState(activeGame?.code);

	useEffect(() => {
		setGameCode(activeGame?.code);
		setRound(activeGame?.round);
	}, [activeGame]);

	const startRound = async () => {
		const response = await START_ROUND(gameCode);

		if(!response.success){
			return toast.error(response.message || 'An error occurred');
		}
	};

	return (
		<div className="nav bg-navBg flex flex-row w-full justify-between items-center px-10 py-2 z-20" style={{
			height: '60px',
			boxShadow: '#0003 0 4px 6px -1px, #0000001f 0 2px 4px -1px'
		}}>
			<Link to="/">
				<p className="font-bold text-18 text-white">Cards Against Cybersecurity</p>
			</Link>

			<div className="absolute flex flex-row items-center justify-center gap-5" style={{
				left: '50%',
				transform: 'translateX(-50%)',
			}}>
				<p className="font-bold text-20 text-white cursor-pointer" onClick={() => {
					navigator.clipboard.writeText(gameCode);
					toast.success('Game code copied to clipboard!');
				}}>{gameCode}</p>
				<p className="font-bold text-20 text-white">{status ? status : round === 0 ? 'Waiting for game to start...' : `Round ${round}`}</p>
			</div>

			<div className="flex flex-row gap-2">
				<Button variant="contained" sx={{ fontSize: 14, mt: 0, height: '100%' }} color="primary" onClick={toggleModal}>
					Game Information
				</Button>

				{isCreator && (
					<Button variant="contained" sx={{ fontSize: 14, mt: 0, height: '100%' }} color="primary" onClick={startRound}>
						Start {round === 0 ? 'Game' : 'Next Round'}
					</Button>
				)}
			</div>
		</div>
	);
};

export default GameNav;