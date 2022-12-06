import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import GameNav from '../components/GameNav';
import UserCards from '../components/UserCards';

import Card from '../components/Card';

const Game = ({ activeGame, userCards, questionCard: questionCardProp, setActiveGame, user, gameFeed, gameRound, players: playersProp }) => {
	const navigate = useNavigate();

	const [cards, setCards] = useState(userCards);
	const [questionCard, setQuestionCard] = useState(questionCardProp);
	const [creator, setCreator] = useState();
	const [players, setPlayers] = useState(playersProp);

	useEffect(() => {
		if(!activeGame?.id){
			return navigate(`/`);
		}

		setCards(userCards);
		setQuestionCard(questionCardProp);
		setCreator(activeGame?.creator);
		setPlayers(playersProp);
	}, [userCards, questionCardProp, activeGame, playersProp]);

	return (
		<div className="flex flex-col h-full w-full overflow-y-hidden">
			<GameNav activeGame={activeGame} isCreator={creator === user}/>

			<div className="grow w-full h-full flex flex-row">
				<div className="h-full left-0 bg-white border-r-4 border-r-black flex flex-col justify-start px-3 py-3 overflow-y-scroll overflow-auto scrollbar-hide" style={{
					width: '250px',
					maxHeight: '100%',
				}}>
					<div className="w-full flex flex-row items-center justify-center mb-3">
						<p className="font-bold text-18">Live Feed</p>
					</div>
					{gameFeed.length === 0 && (
						<p className="text-14 text-center">Game events will appear here!</p>
					)}
					{[...gameFeed].reverse().map((item, index) => {
						const name = item.nameIsId ? players.find(player => player.id === item.name || player.id === item.name)?.name : item.name;

						return <p className="text-12" key={index}><b>{name}</b> {item.message}</p>;
					})}
				</div>

				<div className="grow flex flex-row items-center gap-6 justify-center">
					{questionCard && <Card card={{
						...questionCard,
						type: 'question'
					}} />}
					<Card card={{
						id: 'question-card',
						text: 'Question Cards'
					}} face="back" />
				</div>
			</div>

			<UserCards cards={cards} gameId={activeGame?.id} gameRound={gameRound} user={user}/>
		</div>
	);
}

export default Game;