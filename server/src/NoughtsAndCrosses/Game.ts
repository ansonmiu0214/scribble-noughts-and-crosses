import WebSocket from "ws";
import { S13, S15, S16, S17, S18, S19, S20, S21, S22, S23 } from "./EFSM";
import { Roles, Labels } from "./Constants";

import { Coordinate as Point } from "./Types";

type Partial<T> = {
  [K in keyof T]: T[K] | undefined
}

type RoleToSocket = {
  [Role in Roles]: WebSocket
}

type ChanMessage = {label: string, payload: any}
type RoleToBuffer = {
  [Role in Roles]: ChanMessage[]
}

type MessageHandler = ((message: ChanMessage) => void)

type RoleToHandler = {
  [Role in Roles]: MessageHandler[]
}

interface WebSocketMessage { 
  data: any
  type: string
  target: WebSocket
}

interface JoinMessage {
  connect: Roles
}

export class Svr {

  private wss: WebSocket.Server
  private waiting: Set<Roles>
  private roleToSocket: Partial<RoleToSocket>

  constructor(wss: WebSocket.Server, initialState: S13) {
    this.wss = wss
    this.waiting = new Set<Roles>([Roles.P1, Roles.P2])
    this.roleToSocket = {
      [Roles.P1]: undefined,
      [Roles.P2]: undefined
    }

    const onSubsribe = (event: WebSocketMessage) => {
      const { data, target: socket } = event
      const { connect: role } = JSON.parse(data) as JoinMessage
      if (!this.waiting.has(role)) {
        // Role already occupied
        return
      }

      this.roleToSocket[role] = socket
      this.waiting.delete(role)
      socket.removeEventListener('message', onSubsribe)
      if (this.waiting.size === 0) {
        this.wss.removeListener('connection', onConnection)
        for (const socket of Object.values(this.roleToSocket)) {
          socket?.send(JSON.stringify({
            connected: true
          }))
        }
        new _Svr(this.wss, this.roleToSocket as RoleToSocket, initialState)
      }
    }

    const onConnection = (ws: WebSocket) => ws.addEventListener('message', onSubsribe)
    this.wss.addListener('connection', onConnection)
  }

}

class _Svr {

  private wss: WebSocket.Server
  private roleToSocket: RoleToSocket
  private initialState: S13
  private receiveHandlers: RoleToHandler
  private messageBuffer: RoleToBuffer
  
  constructor(wss: WebSocket.Server, roleToSocket: RoleToSocket, initialState: S13) {
    this.wss = wss
    this.roleToSocket = roleToSocket
    this.initialState = initialState

    this.receiveHandlers = { [Roles.P1]: [], [Roles.P2]: [] }
    this.messageBuffer = { [Roles.P1]: [], [Roles.P2]: [] }

    roleToSocket[Roles.P1].addEventListener('message', this.receive(Roles.P1).bind(this))
    roleToSocket[Roles.P2].addEventListener('message', this.receive(Roles.P2).bind(this))

    // Handle initial state
    this.handle(13, initialState)
  }

  handle(stateId: number, state: any): void {
    switch (stateId) {
      case 13:
        return this.registerHandler_P1(13, state as S13)
      case 15:
        this.roleToSocket.P2.send(JSON.stringify({
          label: (state as S15)[0],
          payload: (state as S15)[1]
        }))
        switch ((state as S15)[0]) {
          case Labels.Lose:
            return this.handle(16, (state as S15)[2])
          case Labels.Draw:
            return this.handle(17, (state as S15)[2])
          case Labels.Update:
            return this.handle(18, (state as S15)[2])
        }
        return
      case 16:
        this.roleToSocket.P1.send(JSON.stringify({
          label: (state as S16)[0],
          payload: (state as S16)[1]
        }))
        return this.end()
      case 17:
        this.roleToSocket.P1.send(JSON.stringify({
          label: (state as S17)[0],
          payload: (state as S17)[1]
        }))
        return this.end()
      case 18:
        this.roleToSocket.P1.send(JSON.stringify({
          label: (state as S18)[0],
          payload: (state as S18)[1]
        }))
        return this.handle(19, (state as S18)[2])
      case 19:
        return this.registerHandler_P2(19, state as S19)
      case 20:
        this.roleToSocket.P1.send(JSON.stringify({
          label: (state as S20)[0],
          payload: (state as S20)[1]
        }))
        switch ((state as S20)[0]) {
          case Labels.Lose:
            return this.handle(21, (state as S20)[2])
          case Labels.Draw:
            return this.handle(22, (state as S20)[2])
          case Labels.Update:
            return this.handle(23, (state as S15)[2])
        }
        return
      case 21:
        this.roleToSocket.P2.send(JSON.stringify({
          label: (state as S21)[0],
          payload: (state as S21)[1]
        }))
        return this.end()
      case 22:
        this.roleToSocket.P2.send(JSON.stringify({
          label: (state as S22)[0],
          payload: (state as S22)[1]
        }))
        return this.end()
      case 23:
        this.roleToSocket.P2.send(JSON.stringify({
          label: (state as S23)[0],
          payload: (state as S23)[1]
        }))
        return this.handle(13, (state as S23)[2])
    }
  }

  registerHandler_P1(stateId: 13, handler: S13): void
  registerHandler_P1(stateId: 13, handler: S13): void {
    const decoratedHandler = (message: any) => {
      const label: 'Pos' = message.label
      const payload: [Point] = message.payload

      const result = handler[label](...payload)
      return this.handle(15, result)
    }

    // Look at whether there are meessages queued.
    if (this.messageBuffer[Roles.P1].length === 0) {
      // Nothing queued, so push the handler.
      this.receiveHandlers[Roles.P1].push(decoratedHandler)
    } else {
      // Pop the message off the queue and process.
      const message = this.messageBuffer[Roles.P1].unshift()
      return decoratedHandler(message)
    }
  }

  registerHandler_P2(stateId: 19, handler: S19): void
  registerHandler_P2(stateId: 19, handler: S19): void {
    const decoratedHandler = (message: any) => {
      const label: 'Pos' = message.label
      const payload: [Point] = message.payload

      const result = handler[label](...payload)
      return this.handle(20, result)
    }

    // Look at whether there are meessages queued.
    if (this.messageBuffer[Roles.P2].length === 0) {
      // Nothing queued, so push the handler.
      this.receiveHandlers[Roles.P2].push(decoratedHandler)
    } else {
      // Pop the message off the queue and process.
      const message = this.messageBuffer[Roles.P2].unshift()
      return decoratedHandler(message)
    }
  }

  receive = (role: Roles) => (message: WebSocketMessage) => {
    const data = JSON.parse(message.data)
    
    // Look at whether there are handlers queued
    if (this.receiveHandlers[role].length === 0) {
      // Nothing queued, so push this message to be handled later.
      this.messageBuffer[role].push(data)
    } else {
      // Pop the handler off the queue.
      return (this.receiveHandlers[role].shift() as MessageHandler)(data)
    }
  }

  end() {
    for (const [_, socket] of Object.entries(this.roleToSocket))
      socket.close()

    new Svr(this.wss, this.initialState)
  }

}