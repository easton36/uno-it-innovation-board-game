const http = require('http');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// initialize mongoose mongodb
require('mongoose').connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`)
	.then(() => {
		console.log(`[MONGODB] Connected to ${process.env.DB_NAME} database`);
	})
	.catch((err) => {
		console.log(`[MONGODB] Error connecting to database: ${err}`);
		process.exit(1);
	});

const ApiRoutes = require('./api/routes/routes');
const ErrorHandler = require('./api/middlewear/error-handler.middlewear');

// initialize express server
const app = express();

// initialize http server with express
const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
	console.log(`[SERVER] Listening on port ${process.env.PORT || 3000}`);
});

// intialize websocket server with http server
require('./websocket/websocket.manager').initialize(server);

app.use(cors({
	exposedHeaders: 'Authorization',
	credentials: true,
	origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://192.168.1.121:5173', 'https://game.easton.gg']
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// built react frontend
app.use(express.static(path.resolve(__dirname, '../frontend/dist')));

// api routes
app.use('/api', ApiRoutes);

app.get('*', function(req, res){
	res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
});

// api error handlers
app.use(ErrorHandler);

// listen for unexpected errors
const EXIT_EVENTS = ['beforeExit', 'SIGINT', 'uncaughtException', 'unhandledRejection'];
EXIT_EVENTS.forEach((event) => {
	process.on(event, (exitCode) => {
		console.log(`[PROCESS] Exiting with code: ${exitCode}`);

		return process.exit(1);
	});
});