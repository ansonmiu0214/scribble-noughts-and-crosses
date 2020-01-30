import { Coordinate as Point } from './Types' 
import { Labels } from './Constants'

export type S1 = {
  Pos: (payload: Point) => S2
}

export type S2 = [Labels.Lose, Point, Point] |
                 [Labels.Draw, Point, Point] |
                 [Labels.Update, Point, Point, S11]

export type S11 = {
  Pos: (payload: Point) => S12
}

export type S12 = [Labels.Lose, Point, Point] |
                  [Labels.Draw, Point, Point] |
                  [Labels.Update, Point, Point, S1]

export type Recv_P1 = S1
export type Recv_P2 = S11