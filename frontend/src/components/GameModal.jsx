import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GameModal = ({ rounds: roundsProp, game, players }) => {
	const [rounds, setRounds] = useState([]);
	const [screen, setScreen] = useState('main');
	const [activeRound, setActiveRound] = useState(null);

	useEffect(() => {
		setRounds([...roundsProp].reverse().filter((round, index, self) => index === self.findIndex(r => r.id === round.id)).reverse());
	}, [roundsProp]);

	return (
		<>
			<div className="close absolute right-0 top-0 z-10 pt-2 pr-2">
				<CloseIcon className="text-icon cursor-pointer hover:text-white" fontSize="medium" style={{
					transition: 'color .2s'
				}}/>
			</div>
			<p className="w-full text-center font-semibold text-18 text-white mb-6">{screen === 'main' ? 'Game Information' : `Round ${activeRound?.round - 1}`}</p>

			{screen === 'main' && (
				<>
					<div className="flex flex-row items-center justify-between w-full gap-2 mb-6">
						<div className="bg-secondaryBg w-1/2 flex flex-col items-center justify-center rounded-lg py-3">
							<p className="w-full text-center text-16 font-semibold text-white mb-2">Game Code</p>
							<p className="w-full text-center text-14 text-white">{game.code}</p>
						</div>
						<div className="bg-secondaryBg w-1/2 flex flex-col items-center justify-center rounded-lg py-3">
							<p className="w-full text-center text-16 font-semibold text-white mb-2">Game Deck</p>
							<p className="w-full text-center text-14 text-white capitalize">{game.deck}</p>
						</div>
					</div>

					<div className="w-full flex flex-col gap-2">
						{[...rounds].map((round, index) => (
							<div className="w-full cursor-pointer hover:bg-secondaryBg transition-colors flex flex-row items-center justify-between rounded-lg border-mainBg border-2 px-3 py-3" key={index} onClick={() => {
								setScreen('round');
								setActiveRound(round);
							}}>
								<p className="font-semibold text-white">Round {index}</p>

								<ArrowRightIcon className="text-white" fontSize="medium"/>
							</div>
						))}
					</div>
				</>
			)}

			{screen === 'round' && (
				<>
					<div className="flex flex-row items-center justify-between w-full gap-2 mb-2">
						<div className="bg-secondaryBg w-1/2 flex flex-col items-center justify-center rounded-lg py-3 px-2">
							<p className="w-full text-center text-16 font-semibold text-white mb-2">Card Czar</p>
							<p className="w-full text-center text-14 text-white">{players.find(player => player.id === activeRound.cardCzar)?.name || 'Unknown'}</p>
						</div>
						<div className="bg-secondaryBg w-1/2 flex flex-col items-center justify-center rounded-lg py-3 px-2">
							<p className="w-full text-center text-16 font-semibold text-white mb-2">Winner</p>
							<p className="w-full text-center text-14 text-white">{players.find(player => player.id === activeRound.cardCzar)?.name || 'Undecided'}</p>
						</div>
					</div>

					<div className="bg-secondaryBg w-full flex flex-col items-center justify-center rounded-lg py-3 mb-2 px-2">
						<p className="w-full text-center text-16 font-semibold text-white mb-2">Question Card</p>
						<p className="w-full text-center text-14 text-white">{activeRound.questionCard?.text?.replaceAll('BLANK', '__________')}</p>
					</div>

					<div className="bg-secondaryBg w-full flex flex-col items-center justify-center rounded-lg py-3 mb-8 px-2">
						<p className="w-full text-center text-16 font-semibold text-white mb-2">Winning Answer</p>
						<p className="w-full text-center text-14 text-white">{activeRound.winningCard?.text || 'Undecided'}</p>
					</div>

					<div className="close absolute left-0 bottom-0 z-10 pb-2 pl-2">
						<Button variant="text" color="primary" startIcon={<ArrowBackIcon />} sx={{ mt: 1 }} onClick={() => setScreen('main')}>Go Back</Button>
					</div>
				</>
			)}
		</>
	);
};

export default GameModal;