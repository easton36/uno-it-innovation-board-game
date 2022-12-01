# uno-it-innovation-board-game
“Cards against humanity” style card game with cybersecurity and bioinformatics style cards

## Authentication
- Users enter a game code when they first visit the website.
- The route /game/join is posted which will validate the game code and assign the user a UUIDv4 which will be stored in a JWT cookie.
- The JWT cookie will be used to authenticate the user for the rest of the game.

## Game
- /game/create will be posted by a user and a game will be created with a 6 digit join code
- Once the game has at more than two members, the game creator will be given the opportunity to start the game by posting /game/:gameCode/start
- When the game starts, each player will be given 10 "white" deck cards
- Each round will start after the last has finished, and will be communicated via websocket
- Once a round starts, a player in the cycle will be the "card czar". They will pick a card from the "black" deck that will be chosen and shown to everyone
- Each user then will choose which card they will use for the round by posting /game/:gameCode/choose
- Once every user has picked their card, a websocket message will be sent to display the results
