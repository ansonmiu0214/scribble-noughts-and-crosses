import http from 'http'
import express from 'express'
import WebSocket from 'ws'

import * as Game from './NoughtsAndCrosses/Game'
import { Coordinate as Point } from './NoughtsAndCrosses/Types'
import { Recv_P1, Recv_P2 } from './NoughtsAndCrosses/EFSM'
import { Labels } from './NoughtsAndCrosses/Constants'

import { board, MoveResult } from './GameLogic'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const handle_P1: Recv_P1 = {
  Pos: (move: Point) => {
    const result = board.p1(move)
    switch (result) {
      case MoveResult.Win:
        board.clear()
        return [Labels.Lose, move, move]
      case MoveResult.Draw:
        board.clear()
        return [Labels.Draw, move, move]
      case MoveResult.Continue:
        return [Labels.Update, move, move, handle_P2]
    }
  }
}

const handle_P2: Recv_P2 = {
  Pos: (move: Point) => {
    const result = board.p2(move)
    switch (result) {
      case MoveResult.Win:
        board.clear()
        return [Labels.Lose, move, move]
      case MoveResult.Draw:
        board.clear()
        return [Labels.Draw, move, move]
      case MoveResult.Continue:
        return [Labels.Update, move, move, handle_P1]
    }
  }
}

new Game.Svr(wss, handle_P1, handle_P2)

const PORT = 8080
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`))

