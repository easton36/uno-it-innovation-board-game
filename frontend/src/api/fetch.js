import Cookies from 'js-cookie';

const API_URL = 'https://game.easton.gg/api';

// sometimes we use localStorage instead of cookies because of CSRF stuff
// on production site that shouldn't be an issue

export const INITIATE_USER = async (name) => {
	const response = await fetch(`${API_URL}/user${name ? `?name=${name}` : ''}`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${Cookies.get('token') || localStorage.getItem('token')}`
		},
	});

	return response.json();
};

export const CREATE_GAME = async (gameLength, deck) => {
	const response = await fetch(`${API_URL}/game/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${Cookies.get('token') || localStorage.getItem('token')}`
		},
		credentials: 'include',
		body: JSON.stringify({
			gameLength,
			deck
		})
	});

	return await response.json();
};

export const JOIN_GAME = async (code) => {
	const response = await fetch(`${API_URL}/game/join`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${Cookies.get('token') || localStorage.getItem('token')}`
		},
		credentials: 'include',
		body: JSON.stringify({
			code
		})
	});

	return await response.json();
};

export const FETCH_GAME_INFO = async (code) => {
	const response = await fetch(`${API_URL}/game/${code}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${Cookies.get('token') || localStorage.getItem('token')}`
		},
		credentials: 'include'
	});

	return await response.json();
};

export const CHOOSE_ROUND_CARD = async (code, cardId) => {
	const response = await fetch(`${API_URL}/game/${code}/pick-card`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${Cookies.get('token') || localStorage.getItem('token')}`
		},
		credentials: 'include',
		body: JSON.stringify({
			cardId
		})
	});

	return await response.json();
};

export const CHOOSE_ROUND_WINNER = async (code, userId) => {
	const response = await fetch(`${API_URL}/game/${code}/pick-winner`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${Cookies.get('token') || localStorage.getItem('token')}`
		},
		credentials: 'include',
		body: JSON.stringify({
			userId
		})
	});

	return await response.json();
};

export const START_ROUND = async (code) => {
	const response = await fetch(`${API_URL}/game/${code}/start`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${Cookies.get('token') || localStorage.getItem('token')}`
		},
		credentials: 'include'
	});

	return await response.json();
};