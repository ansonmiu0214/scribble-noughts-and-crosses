import { GameReducer, GameState, Cell, Result, ActionType, Action } from "./../Types"
import { Coordinate as Point } from "../../NoughtsAndCrosses/Types"

const initialState: GameState = {
  board: [[Cell.Empty, Cell.Empty, Cell.Empty],
          [Cell.Empty, Cell.Empty, Cell.Empty],
          [Cell.Empty, Cell.Empty, Cell.Empty]],
  winner: Result.Nothing
}

const updateMove = (role: Cell) => (state: GameState, point: Point) => ({
  ...state,
  board: state.board.map((row, x) => (
    row.map((cell, y) => x === point.x && y === point.y ? role : cell)
  )),
})

const setResult = (state: GameState, result: Result) => ({
  ...state,
  winner: result
})

const reducers: { [A in ActionType]: GameReducer<any> } = {
  [ActionType.P1_MOVE]: updateMove(Cell.P1),
  [ActionType.P2_MOVE]: updateMove(Cell.P2),
  [ActionType.RESULT]: setResult,
}

const gameReducer = (state = initialState, action: Action) => {
  const reducer = reducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}

export default gameReducer