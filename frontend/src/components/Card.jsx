import { useState, useEffect, useMemo } from 'react';

import DashboardIcon from '@mui/icons-material/Dashboard';

const Card = ({ card: cardProp, selected: selectedProp, selectCard: selectCardProp, face = 'front' }) => {
	const [card, setCard] = useState(cardProp);
	const [selected, setSelected] = useState(selectedProp);

	useEffect(() => {
		setCard(cardProp);
		setSelected(selectedProp);
	}, [selectedProp, cardProp]);

	const selectCard = () => {
		if(card.type !== 'answer') return;

		selectCardProp(card, () => {
			setSelected(prev => !prev);
		});
	};

	const cardText = useMemo(() => {
		if(card.text?.includes('BLANK')){
			return card.text?.replaceAll('BLANK', '__________');
		}

		return card.text?.replace('..', '.');
	});

	return (
        <div className={`select-none relative border-4 ${selected ? 'border-primary translate-y-cardHover' : 'border-black'} ${card.type === 'answer' ? 'bg-offWhite text-black h-answerCardHeight xl:h-answerCardHeightXL w-answerCardWidth xl:w-answerCardWidthXL' : 'bg-black text-white h-questionCardHeight xl:h-questionCardHeightXL w-questionCardWidth xl:w-questionCardWidthXL'} py-2 z-40 flex flex-col items-start cursor-pointer transition transform duration-300 ${face === 'front' && 'hover:translate-y-cardHover'}`} style={{
			borderRadius: '12px',
			filter: 'drop-shadow(6px 6px 0 #000)'
		}} onClick={selectCard}>
			<p className={`font-bold ${face === 'front' ? 'text-18' : 'text-30'} px-2.5`} style={{
				marginTop: '10%'
			}}>{cardText}</p>

			{face === 'front' && (
				<div className="w-full flex flex-row items-center justify-center bottom-0 absolute py-2">
					<DashboardIcon style={{
						width: '16px',
						height: '16px'
					}}/>
					<p className="ml-1 font-bold text-12">{card.type === 'answer' ? 'Answer' : 'Question'} Card</p>
				</div>
			)}
		</div>
	);
};

export default Card;