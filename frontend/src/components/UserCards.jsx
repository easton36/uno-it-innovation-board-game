import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

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
			<div className="transition-spacing duration-200 ease absolute bg-black text-white hover:bg-white hover:text-black transition-colors border-4 border-black rounded-6 py-1 px-5 cursor-pointer flex flex-row items-center" style={{
				left: '50%',
				bottom: (selectedCard && !locked && canSelect) ? '260px' : '200px',
				transform: 'translateX(-50%)'
			}} onClick={submitAnswer}>
				<p className="font-bold text-16">{isCzar ? 'Choose Winner' : 'Submit Answer'}</p>
			</div>

			<div className="w-full bg-white border-t-4 border-t-black z-30 overflow-x-auto overflow-y-hidden" style={{
				minHeight: '250px'
			}}>
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