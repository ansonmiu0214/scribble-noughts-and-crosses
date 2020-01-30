import React from "react"
import * as P1 from "../../NoughtsAndCrosses/P1"
import { Coordinate as Point } from "../../NoughtsAndCrosses/Types"
import Board from "../Board"

export default class MakeMove extends P1.S31 {
  render() {
    const makeMove = (point: Point) => this.props.Pos('Click', event => {
      event.preventDefault()
      return point
    })

    return <div>
      <h2>MakeMove!</h2>
      <Board makeMove={makeMove.bind(this)} />
    </div>
  }
}