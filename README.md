# Noughts and Crosses with Scribble [![arXiv](https://img.shields.io/badge/arXiv-2004.01321-b31b1b.svg)](https://arxiv.org/abs/2004.01321)
A game of Noughts and Crosses written in TypeScript implementing a communication protocol written in Scribble.

> ## _Generating Interactive WebSocket Applications in TypeScript (PLACES 2020)_
> __Anson Miu, Francisco Ferreira, Nobuko Yoshida, Fangyi Zhou__

![](./example.gif)

## Getting started

Prerequisites:
* Node.js
  * `brew install node` or equivalent
* TypeScript
  * `npm i -g typescript`

Install packages:
```bash
# Server
cd server/
npm install

cd ../

# Client
cd client/
npm install
```

## Usage
Open a separate terminal for the Game Client and Game Server.

1. Run the server:
```bash
cd server/
npm run-script build
npm start
```

2. Run the client:
```bash
cd client/
npm start
```

3. Access `localhost:3000` on 2 separate browser windows
4. Play!

## Session Types
[Scribble](http://www.scribble.org/) protocol of game logic available as [`NoughtsAndCrosses.scr`](NoughtsAndCrosses.scr).

## Implementation
Refer to [`server/README.md`](server/README.md) and [`client/README.md`](client/README.md) for details on the generated code and user implementation.

__Update (25/02/2020):__ WIP code generation repository found under [`TypeScript-Multiparty-Sessions`](https://github.com/ansonmiu0214/TypeScript-Multiparty-Sessions).
