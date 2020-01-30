import React from "react"
import { Roles } from "../../NoughtsAndCrosses/Constants"
import * as P1 from "../../NoughtsAndCrosses/P1"

import { Coordinate as Point } from "./../../NoughtsAndCrosses/Types"

import { connect, ConnectedProps } from "react-redux"
import { RootState } from "../../GameLogic/reducers"
import { playerOneMove, playerTwoMove, receiveResult } from '../../GameLogic/Actions'
import { Result } from "../../GameLogic/Types"
import Board from "../Board"
import { AsModelType } from "../../NoughtsAndCrosses/Runtime"

export default function waitOpponent(role: Roles) {

  const mapState = (_: RootState) => ({})
  const mapDispatch = { 
    makeMove: role === Roles.P1 ? playerTwoMove : playerOneMove,
    receiveResult
  }

  const connector = connect(mapState, mapDispatch)
  type PropsFromRedux = ConnectedProps<typeof connector>
  
  class WaitForOpponent extends P1.S34<PropsFromRedux> {
    Lose(move: Point) {
      this.props.makeMove(move)
      this.props.receiveResult(Result.Lose)
    }

    Draw(move: Point) {
      this.props.makeMove(move)
      this.props.receiveResult(Result.Draw)
    }

    Update(move: Point) {
      this.props.makeMove(move)
    }

    render() {
      return <div>
        <h2>Waiting opponent!</h2>
        <Board />
      </div>
    }
  }

  return AsModelType<WaitForOpponent>(connector(WaitForOpponent))

}