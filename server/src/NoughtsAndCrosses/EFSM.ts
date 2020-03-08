import { Coordinate as Point } from './Types' 
import { Labels } from './Constants'

export type S13 = {
  Pos: (payload: Point) => S15
}

export type S15 = [Labels.Lose, Point, S16] |
                  [Labels.Draw, Point, S17] |
                  [Labels.Update, Point, S18]
export type S16 = [Labels.Win, Point]
export type S17 = [Labels.Draw, Point]
export type S18 = [Labels.Update, Point, S19]

export type S19 = {
  Pos: (payload: Point) => S20
}

export type S20 = [Labels.Lose, Point, S21] |
                  [Labels.Draw, Point, S22] |
                  [Labels.Update, Point, S23]
export type S21 = [Labels.Win, Point]
export type S22 = [Labels.Draw, Point]
export type S23 = [Labels.Update, Point, S13]