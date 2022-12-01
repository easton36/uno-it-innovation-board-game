const API_URL = 'http://localhost:3000/api';

export const INITIATE_USER = async () => {
	const response = await fetch(`${API_URL}/user`, {
		method: 'GET',
		credentials: 'include'
	});

	return response.json();
};

export const CREATE_GAME = async (gameLength, deck) => {
	const response = await fetch(`${API_URL}/game/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		},
		credentials: 'include',
		body: JSON.stringify({
			gameLength,
			deck
		})
	});

	return await response.json();
};