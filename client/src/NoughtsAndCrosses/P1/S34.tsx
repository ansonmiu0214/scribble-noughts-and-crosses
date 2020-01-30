import { Component } from "react"
import { Coordinate as Point } from "../Types"
import { ReceiveHandlerMap } from "../Runtime"

type P = {
  register: (handlers: ReceiveHandlerMap) => void
}

export abstract class S34<_P = {}, _S = {}, _SS = any> extends Component<P & _P, _S, _SS> {

  componentDidMount() {
    this.props.register({
      Lose: this.Lose.bind(this),
      Draw: this.Draw.bind(this),
      Update: this.Update.bind(this),
    })  
  }

  abstract Lose(point: Point): void
  abstract Draw(point: Point): void
  abstract Update(point: Point): void

}