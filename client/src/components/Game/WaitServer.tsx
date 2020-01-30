import React from "react"
import { Roles } from "../../NoughtsAndCrosses/Constants"
import * as P1 from "../../NoughtsAndCrosses/P1"

import { Coordinate as Point } from "../../NoughtsAndCrosses/Types"

import { connect, ConnectedProps } from "react-redux"
import { RootState } from "../../GameLogic/reducers"
import { playerOneMove, playerTwoMove, receiveResult } from '../../GameLogic/Actions'
import { AsModelType } from "../../NoughtsAndCrosses/Runtime"
import { Result } from "../../GameLogic/Types"
import Board from "../Board"

export default function waitServer(role: Roles) {

  const mapState = (_: RootState) => ({})
  const mapDispatch = { 
    makeMove: role === Roles.P1 ? playerOneMove : playerTwoMove,
    receiveResult
  }

  const connector = connect(mapState, mapDispatch)
  type PropsFromRedux = ConnectedProps<typeof connector>

  class WaitForServer extends P1.S33<PropsFromRedux> {
  
    Win(move: Point) {
      this.props.makeMove(move)
      this.props.receiveResult(Result.Win)
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
        <h2>Waiting for server!</h2>
        <Board />
      </div>
    }
  }

  return AsModelType<WaitForServer>(connector(WaitForServer))

}