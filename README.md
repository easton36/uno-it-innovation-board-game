# uno-it-innovation-board-game
“Cards against humanity” style card game with cybersecurity and bioinformatics style cards

## API Documentation
https://documenter.getpostman.com/view/12460638/2s8Yt1tqQf

## Authentication
- Users enter a game code when they first visit the website.
- The route /game/join is posted which will validate the game code and assign the user a UUIDv4 which will be stored in a JWT cookie.
- The JWT cookie will be used to authenticate the user for the rest of the game.

## Game
- `/game/create` will be posted by a user and a game will be created with a 6 character join code
- Once the game has at more than two members, the game creator will be given the opportunity to start the game by posting `/game/:gameCode/start`
- When the game starts, each player will be given 10 "white" deck cards
- Each round will start after the last has finished, and will be communicated via websocket
- Once a round starts, a player in the cycle will be the "card czar". They will pick a card from the "black" deck (by posting `/game/:gameCode/choose/black` that will be chosen and shown to everyone
- Each user then will choose which card they will use for the round by posting `/game/:gameCode/choose/white`
- Once every user has picked their card, a websocket message will be sent to display the cards each user has chosen
- The "card czar" will then pick the card they think is the best, and the winning user will be awarded points.
- At the end of X rounds, user with the most points wins
