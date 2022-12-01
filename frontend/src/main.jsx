import React from 'react';
import ReactDOM from 'react-dom/client';

import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";

import App from './App';
import CreateGame from './views/CreateGame';
import JoinGame from './views/JoinGame';

import './index.css';

const router = createBrowserRouter([
	{
	  path: "/",
	  element: <App />,
	},
	{
		path: "/create-game",
		element: <CreateGame />,
	},
	{
		path: "/join-game",
		element: <JoinGame />,
	}
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
