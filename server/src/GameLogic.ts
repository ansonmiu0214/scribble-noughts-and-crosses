/**
 * User implementation of game board state.
 * Export game board instance.
 */

import { Coordinate as Point } from './NoughtsAndCrosses/Types'

enum Cell { Empty, P1, P2 }
export enum MoveResult { Win, Draw, Continue }

class Board {

  private _board: Array<Array<Cell>>
  private _emptyCellCount: number 

  constructor() {
    this._board = [[Cell.Empty, Cell.Empty, Cell.Empty],
                   [Cell.Empty, Cell.Empty, Cell.Empty],
                   [Cell.Empty, Cell.Empty, Cell.Empty]]
    this._emptyCellCount = 9
  }

  // Factory for generating a function that, given a player role,
  // places the marker and returns the game result with respect to that player.
  private _makeMove = (marker: Cell) => ({ x: row, y: col }: Point) => {
    // Update board state
    this._board[row][col] = marker
    this._emptyCellCount--

    // Check for winning move
    if (this._board[row].every(cell => cell === marker)) /* Winning row */
      return MoveResult.Win

    if (this._board.every(row => row[col] === marker)) /* Winning column */
      return MoveResult.Win

    if (row === 1 && col === 1) /* Placed middle marker - check corners */
      if ((this._board[0][0] === marker && this._board[2][2] === marker) ||
          (this._board[0][2] === marker && this._board[2][0] === marker))
        return MoveResult.Win
      
    if (row !== 1 && col !== 1) /* Placed corner marker - check diagonals */
      if (this._board[1][1] === marker && this._board[2 - row][2 - col] === marker)
        return MoveResult.Win

    return this._emptyCellCount === 0 ? MoveResult.Draw : MoveResult.Continue
  }

  p1(move: Point) { return this._makeMove(Cell.P1)(move) }
  p2(move: Point) { return this._makeMove(Cell.P2)(move) }

  clear() {
    this._board = [[Cell.Empty, Cell.Empty, Cell.Empty],
                   [Cell.Empty, Cell.Empty, Cell.Empty],
                   [Cell.Empty, Cell.Empty, Cell.Empty]]
    this._emptyCellCount = 9
  }
  
}

// Initialise state
export const board = new Board()