import React from "react"

import * as P1 from "../../NoughtsAndCrosses/P1"
import { RootState } from "../../GameLogic/reducers"
import { connect, ConnectedProps } from "react-redux"
import { Result } from "../../GameLogic/Types"
import Board from "../Board"
import { AsModelType } from "../../NoughtsAndCrosses/Runtime"

const mapState = (state: RootState) => ({
  winner: state.game.winner
})

const connector = connect(mapState)
type PropsFromRedux = ConnectedProps<typeof connector>

class ResultView extends P1.S32<PropsFromRedux> {
  render() {
    return (
      <div>
        {this.props.winner === Result.Win && <h2>You won!</h2>}
        {this.props.winner === Result.Draw && <h2>Draw!</h2>}
        {this.props.winner === Result.Lose && <h2>You lose!</h2>}
        <Board />
      </div>
    )
  }

}

export default AsModelType<ResultView>(connector(ResultView))