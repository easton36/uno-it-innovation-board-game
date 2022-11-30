# uno-it-innovation-board-game
“Cards against humanity” style card game with cybersecurity and bioinformatics style cards

## Authentication
- Users enter a game code when they first visit the website.
- The route /game/join is posted which will validate the game code and assign the user a UUIDv4 which will be stored in a JWT cookie.
- The JWT cookie will be used to authenticate the user for the rest of the game.