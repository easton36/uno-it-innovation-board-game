import { useState, useEffect } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const GameSidebar = ({ gameFeed: gameFeedProp, players: playersProp }) => {
	const [gameFeed, setGameFeed] = useState(gameFeedProp);
	const [players, setPlayers] = useState(playersProp);
	const [page, setPage] = useState('feed');

	useEffect(() => {
		setGameFeed(gameFeedProp);
		setPlayers(playersProp);
	}, [gameFeedProp, playersProp]);

	// <p className="font-bold text-18">Live Feed</p>
	return (
		<div className="sidebar bg-secondaryBg relative flex flex-col justify-start overflow-y-scroll overflow-x-hidden text-white">
			<div className="w-full flex flex-row">
				<Tabs value={page} onChange={(e, newPage) => setPage(newPage)} aria-label="basic tabs example" textColor="primary" indicatorColor="primary" sx={{ width: '100%' }}>
					<Tab label="Game Feed" value="feed" id="simple-tab-0" aria-controls="simple-tabpanel-0" sx={{ width: '50%' }}/>
					<Tab label="Players" value="players" id="simple-tab-1" aria-controls="simple-tabpanel-1" sx={{ width: '50%' }}/>
				</Tabs>
				
			</div>
			
			{page === 'feed' && (
				<div className="px-3 py-3">
					{gameFeed.length === 0 && (
						<p className="text-14 text-center">Game events will appear here!</p>
					)}
					{[...gameFeed].reverse().map((item, index) => {
						const name = item.nameIsId ? players.find(player => player.id === item.name || player.id === item.name)?.name : item.name;

						return (
							<div className="w-full flex flex-row items-center mb-1.5" key={index}>
								<p className="text-12 grow" style={{
									maxWidth: '200px'
								}}><b>{name}</b> {item.message}</p>
								<p className="text-12 ml-2">{new Date(item.timestamp)?.toLocaleTimeString()}</p>
							</div>
						);
					})}
				</div>
			)}
			
			{page === 'players' && (
				<div className="px-4 py-3">
					<div className="w-full flex flex-row justify-between mb-2 grid grid-cols-4">
						<p className="text-14 font-semibold">ID</p>
						<p className="text-14 font-semibold">Name</p>
						<p className="text-14 font-semibold">Points</p>
						<p className="text-14 font-semibold">Card Czar</p>
					</div>
					{[...players].map((player, index) => (
						<div className="w-full grid grid-cols-4 mb-2" key={index}>
							<p className="text-14 text-left w-full">#{index}</p>
							<p className="text-14 text-left w-full">{player.name}</p>
							<p className="text-14 text-left w-full">{player.points || 0}</p>
							<p className="text-14 text-left w-full">{player.cardCzar ? 'Yes' : 'No'}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default GameSidebar;