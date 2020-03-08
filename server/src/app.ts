import http from 'http'
import express from 'express'
import WebSocket from 'ws'

import * as Game from './NoughtsAndCrosses/Game'
import { Coordinate as Point } from './NoughtsAndCrosses/Types'
import { S13, S19 } from './NoughtsAndCrosses/EFSM'
import { Labels } from './NoughtsAndCrosses/Constants'

import { board, MoveResult } from './GameLogic'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const handle_P1: S13 = {
  Pos: (move: Point) => {
    const result = board.p1(move)
    switch (result) {
      case MoveResult.Win:
        board.clear()
        return [Labels.Lose, move, [Labels.Win, move]]
      case MoveResult.Draw:
        board.clear()
        return [Labels.Draw, move, [Labels.Draw, move]]
      case MoveResult.Continue:
        return [Labels.Update, move, [Labels.Update, move, handle_P2]]
    }
  }
}

const handle_P2: S19 = {
  Pos: (move: Point) => {
    const result = board.p2(move)
    switch (result) {
      case MoveResult.Win:
        board.clear()
        return [Labels.Lose, move, [Labels.Win, move]]
      case MoveResult.Draw:
        board.clear()
        return [Labels.Draw, move, [Labels.Draw, move]]
      case MoveResult.Continue:
        return [Labels.Update, move, [Labels.Update, move, handle_P1]]
    }
  }
}

new Game.Svr(wss, handle_P1)

const PORT = 8080
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`))

