import { combineReducers } from "redux"
import GameReducer from "./GameReducer"

const rootReducer = combineReducers({
  game: GameReducer
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>