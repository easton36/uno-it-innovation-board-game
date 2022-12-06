# uno-it-innovation-board-game
“Cards against humanity” style card game with cybersecurity and bioinformatics style cards

## API Documentation
https://documenter.getpostman.com/view/12460638/2s8Yt1tqQf

## Authentication
- Users enter a desired name when they first visit the website
- This will post a route that will assign the user a unique UUIDv4 and sign a JSON Web Token (JWT) containing the user ID and name. (This will be used to authenticate the user)
- Every time a user "hits" a protected route, we will validate the JWT (either as a cookie or header) and use the encoded User ID to process actions.

## Playing the Game