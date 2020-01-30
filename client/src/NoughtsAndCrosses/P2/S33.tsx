import { Component } from "react"
import { Coordinate as Point } from "./../Types"
import { ReceiveHandlerMap } from "../Runtime"

type P = {
  register: (handlers: ReceiveHandlerMap) => void
}

export abstract class S33<_P = {}, _S = {}, _SS = any> extends Component<P & _P, _S, _SS> {

  componentDidMount() {
    this.props.register({
      Win: this.Win.bind(this),
      Draw: this.Draw.bind(this),
      Update: this.Update.bind(this)
    })
  }

  abstract Win(point: Point): void
  abstract Draw(point: Point): void
  abstract Update(point: Point): void

}