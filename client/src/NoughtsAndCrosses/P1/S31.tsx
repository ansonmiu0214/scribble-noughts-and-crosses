import { Component } from "react"
import { Coordinate as Point } from "../Types"
import { SendComponentFactory } from "../Runtime"

type P = {
  Pos: SendComponentFactory<Point>
}

export abstract class S31<_P = {}, _S = {}, _SS = any> extends Component<P & _P, _S, _SS> {}