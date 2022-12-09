import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';

import { CHOOSE_ROUND_CARD, CHOOSE_ROUND_WINNER } from '../api/fetch';

import Card from '../components/Card';

const UserCards = ({ cards: cardsProp, gameId, user, gameRound }) => {
	const [selectedCard, setSelectedCard] = useState(null);
	const [cards, setCards] = useState(cardsProp);
	const [locked, setLocked] = useState(false);
	const [round, setRound] = useState(gameRound?.round);

	useEffect(() => {
		setCards(cardsProp);
	}, [cardsProp]);

	useEffect(() => {
		if(gameRound?.round !== round){
			setLocked(false);
			setRound(gameRound?.round);
			setSelectedCard(null);
		}
	}, [gameRound?.round]);

	const isCzar = useMemo(() => {
		if(user === gameRound?.cardCzar) return true;

		return false;
	});

	const canSelect = useMemo(() => {
		return true;
		if(user === gameRound?.cardCzar){
			return gameRound?.status === 'czar_choosing_winner';
		}

		return gameRound?.status === 'players_choosing_cards';
	});

	const selectCard = (card, callback) => {
		if(locked) return;

		if(card?.id !== selectedCard?.id || !selectedCard){
			setSelectedCard(card);
		} else{
			setSelectedCard(null);
		}

		callback();
	};

	const submitAnswer = async () => {
		const response = isCzar ? await CHOOSE_ROUND_WINNER(gameId, selectedCard.owner) : await CHOOSE_ROUND_CARD(gameId, selectedCard.id);

		if(!response.success){
			return toast.error(response.message || 'An error has occurred');
		}

		setLocked(true);
	};

	return (
		<>
			<div className="-translate-x-1/2 transition-spacing duration-200 ease absolute text-white" style={{
				left: '50%',
				bottom: (selectedCard && !locked && canSelect) ? '250px' : '100px'
			}} onClick={submitAnswer}>
				<Button variant="contained" sx={{ fontSize: 16, fontWeight: 500, mt: 0, height: '100%' }} color="primary">
					{isCzar ? 'Choose Winner' : 'Submit Answer'}
				</Button>
			</div>

			<div className="cards bg-footerBg text-white z-30 overflow-x-auto overflow-y-hidden">
				<div className={`w-full h-full z-50 px-6 py-4 flex flex-row ${cards?.length > 5 ? '2xl:justify-center' : 'justify-center'} items-center gap-6`}>
					{(!Array.isArray(cards) || cards?.length === 0) ? (
						<div className="w-full flex flex-row justify-center">
							<p className="text-18 font-bold">{isCzar ? 'As players answer, their cards will appear here!' : 'Your cards will appear here once the round starts!'}</p>
						</div>
					) : cards?.map(card => (
						<Card key={card?.id} card={{
							id: card.id,
							type: 'answer',
							text: card.text,
							owner: card.owner
						}} selectCard={selectCard} selected={selectedCard?.id === card?.id}/>
					))}
				</div>
			</div>
		</>
	);
};

export default UserCards;