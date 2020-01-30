import { Coordinate as Point } from "./../NoughtsAndCrosses/Types"
import { ActionType, Result } from "./Types"

export const playerOneMove = (point: Point) => ({
  type: ActionType.P1_MOVE,
  payload: point
})

export const playerTwoMove = (point: Point) => ({
  type: ActionType.P2_MOVE,
  payload: point
})

export const receiveResult = (result: Result) => ({
  type: ActionType.RESULT,
  payload: result
})