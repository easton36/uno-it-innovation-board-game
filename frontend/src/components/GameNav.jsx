import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import  { START_ROUND } from '../api/fetch';

const GameNav = ({ activeGame, isCreator }) => {
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
		<div className="w-full bg-white border-b-4 border-b-black flex flex-row justify-between items-center px-6 py-4 z-20">
			<p className="font-bold text-20">Cards Against Humanity</p>

			<div className="absolute flex flex-row items-center justify-center gap-3" style={{
				left: '50%',
				transform: 'translateX(-50%)',
			}}>
				<p className="font-bold text-20">{gameCode}</p>
				<p className="font-bold text-20">{round === 0 ? 'Waiting for game to start...' : `Round ${round}`}</p>
			</div>

			{isCreator && (
				<div className="bg-black text-white hover:bg-white hover:text-black transition-colors border-4 border-black rounded-6 py-1 px-5 cursor-pointer flex flex-row items-center" onClick={startRound}>
					<p className="font-bold text-16">Start {round === 0 ? 'Game' : 'Next Round'}</p>
				</div>
			)}
		</div>
	);
};

export default GameNav;