import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux'
import { Cell } from '../GameLogic/Types';
import { Constructor } from '../NoughtsAndCrosses/Runtime';
import { Coordinate as Point } from "../NoughtsAndCrosses/Types"

import { RootState } from "../GameLogic/reducers"
import { playerOneMove, playerTwoMove } from '../GameLogic/Actions';

const mapState = (state: RootState) => ({
  board: state.game.board
})

const mapDispatch = { playerOneMove, playerTwoMove }

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type P = PropsFromRedux & {
  makeMove?: (point: Point) => Constructor<Component>
}

class Board extends Component<P> {
  render() {
    return (
      <table className='Board'>
        <tbody>
        {this.props.board.map((row, x) => (
          <tr key={x}>
            {row.map((marker, y) => {
              const key = (x + 1) * y
              const className = (marker === Cell.Empty && this.props.makeMove) ? 'empty' : marker === Cell.P1 ? 'P1' : marker === Cell.P2 ? 'P2' : ''
              const GridCell = (
                <td key={key} className={`grid ${className}`}>
                  {marker === Cell.Empty ? ' ' : marker === Cell.P1 ? 'X' : 'O'}
                </td>
              )
              if (marker === Cell.Empty && this.props.makeMove) {
                const MakeMove = this.props.makeMove({ x, y })
                return <MakeMove key={key}>{GridCell}</MakeMove>
              }
              return GridCell
            })}
          </tr>
        ))}
        </tbody>
      </table>
    );
  }
}

export default connector(Board)