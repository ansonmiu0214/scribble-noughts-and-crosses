import { Coordinate as Point } from "./../NoughtsAndCrosses/Types"

export enum Cell { Empty, P1, P2 }
export enum Result { Win, Lose, Draw, Nothing }

// Store
export interface GameState {
  board: Array<Array<Cell>>,
  winner: Result
}

// Reducers
export type GameReducer<T> = (state: GameState, payload: T) => GameState

// Actions
export enum ActionType {
  P1_MOVE = 'P1_MOVE',
  P2_MOVE = 'P2_MOVE',
  RESULT = 'RESULT',
}

interface PlayerOneMove {
  type: ActionType.P1_MOVE
  payload: Point
}

interface PlayerTwoMove {
  type: ActionType.P1_MOVE
  payload: Point
}

interface ReceiveResult {
  type: ActionType.RESULT
  payload: Result
}

export type Action = PlayerOneMove 
                   | PlayerTwoMove 
                   | ReceiveResult