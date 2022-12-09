import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import GameNav from '../components/GameNav';
import UserCards from '../components/UserCards';
import GameSidebar from '../components/GameSidebar';
import GameModal from '../components/GameModal';

import Card from '../components/Card';

const Game = ({ activeGame, userCards, questionCard: questionCardProp, user, gameFeed, gameRound, players: playersProp }) => {
	const navigate = useNavigate();

	const [cards, setCards] = useState(userCards);
	const [questionCard, setQuestionCard] = useState(questionCardProp);
	const [creator, setCreator] = useState();
	const [players, setPlayers] = useState(playersProp);
	const [rounds, setRounds] = useState(activeGame?.rounds || {});

	const [modalOpen, setModalOpen] = useState(false);

	const toggleModal = () => {
		setModalOpen(prev => !prev);
	};

	useEffect(() => {
		if(!activeGame?.id){
			return navigate(`/`);
		}

		setCards(userCards);
		setQuestionCard(questionCardProp);
		setCreator(activeGame?.creator);
		setPlayers(playersProp);
		setRounds(activeGame.rounds);
	}, [userCards, questionCardProp, activeGame, playersProp]);

	return (
		<div className="game bg-mainBg">
			<GameNav activeGame={activeGame} isCreator={creator === user} toggleModal={toggleModal}/>
			<UserCards cards={cards} gameId={activeGame?.id} gameRound={gameRound} user={user}/>

			<GameSidebar gameFeed={gameFeed} players={players}/>

			<div className="content flex flex-row items-center gap-6 justify-center">
				{questionCard?.text && <Card card={{
					...questionCard,
					type: 'question'
				}} />}
				<Card card={{
					id: 'question-card',
					text: 'Question Cards'
				}} face="back" />
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
					<GameModal rounds={rounds} game={activeGame} players={players}/>
				</Box>
			</Modal>
		</div>
	);
}

export default Game;