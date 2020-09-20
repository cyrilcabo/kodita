# Kodita

## Introduction
Kodita is a web-based, multiplayer, game of bluff. Kodita is an online adaptation of the card game, coup d’etat. To master this game, you have to be a good liar. Well, besides the need to have heavy planning and good strategy... and being a good liar.

### Demo
Kodita is live at: https://kodita.herokuapp.com . Check it out, and don't forget to follow me for more projects like this.

## Technologies
Bookmate is currently built with the following technologies:
* NodeJS
* ExpressJS
* ReactJS
* NextJS
* Material-UI
* Socket.io

## Setup
You can clone the repository to your local machine. Be sure that you have NodeJS installed. You can then run `npm install`, and after installing dependencies, run `npm build`. Finally, you can run `npm start`, and check your application running at `http://localhost:3000`.

## Features
### Kodita Homepage
Once you first visit Kodita, you will be asked to enter you IGN (in-game name) on the homepage, before you can proceed. IGNs need to be alteast 5 characters. On the homepage, you can also view the instructions on how to play the game.

### Game Lobby
On the Game Lobby, you can see the list of games that are active. You can see if the game is either still in lobby, or is already starting. You can only join the game, if it hasn't started yet. Furthermore, if there are a lot of games, you can search for a game room, by searching the IGN of the game host.

### Game Room
On the Game Room page, you can play Kodita! It is divided into three sections: players' list, actions panel and the actions history of each round. Each player will have to take turns until someone wins the game. The game will only end when one wins, or there's only a single player remaining (when other players quit).
