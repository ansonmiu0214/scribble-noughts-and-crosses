import WebSocket from "ws";
import { Recv_P1, Recv_P2 } from "./EFSM";
import { Roles, Labels } from "./Constants";

import { Coordinate as Point } from "./Types";

type Partial<T> = {
  [K in keyof T]: T[K] | undefined
}

type RoleToSocket = {
  [Role in Roles]: WebSocket
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

  constructor(wss: WebSocket.Server, handle_P1: Recv_P1, handle_P2: Recv_P2) {
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
        new _Svr(this.wss, this.roleToSocket as RoleToSocket, handle_P1, handle_P2)
      }
    }

    const onConnection = (ws: WebSocket) => ws.addEventListener('message', onSubsribe)
    this.wss.addListener('connection', onConnection)
  }

}

class _Svr {

  private wss: WebSocket.Server
  private roleToSocket: RoleToSocket
  private handle_P1: Recv_P1
  private handle_P2: Recv_P2

  constructor(wss: WebSocket.Server, roleToSocket: RoleToSocket, handle_P1: Recv_P1, handle_P2: Recv_P2) {
    this.wss = wss
    this.roleToSocket = roleToSocket
    this.handle_P1 = handle_P1
    this.handle_P2 = handle_P2

    roleToSocket[Roles.P1].addEventListener('message', this.receive_P1.bind(this))
    roleToSocket[Roles.P2].addEventListener('message', this.receive_P2.bind(this))
  }

  end() {
    for (const [_, socket] of Object.entries(this.roleToSocket))
      socket.close()

    new Svr(this.wss, this.handle_P1, this.handle_P2)
  }

  receive_P1(message: WebSocketMessage) {
    const data = JSON.parse(message.data)
    const payload = data.payload as [Point]
    const result = this.handle_P1.Pos(...payload)
    switch (result[0]) {
      case Labels.Lose: {
        this.roleToSocket.P2.send(JSON.stringify({
          label: Labels.Lose,
          payload: result[1]
        }))

        this.roleToSocket.P1.send(JSON.stringify({
          label: Labels.Win,
          payload: result[2]
        }))

        return this.end()
      }
      case Labels.Draw: {
        this.roleToSocket.P2.send(JSON.stringify({
          label: Labels.Draw,
          payload: result[1]
        }))

        this.roleToSocket.P1.send(JSON.stringify({
          label: Labels.Draw,
          payload: result[2]
        }))

        return this.end()
      }
      case Labels.Update: {
        this.roleToSocket.P2.send(JSON.stringify({
          label: Labels.Update,
          payload: result[1]
        }))

        this.roleToSocket.P1.send(JSON.stringify({
          label: Labels.Update,
          payload: result[2]
        }))

        break
      }
    }
  }

  receive_P2(message: WebSocketMessage) {
    const data = JSON.parse(message.data)
    const payload = data.payload as [Point]
    const result = this.handle_P2.Pos(...payload)
    switch (result[0]) {
      case Labels.Lose: {
        this.roleToSocket.P1.send(JSON.stringify({
          label: Labels.Lose,
          payload: result[1]
        }))

        this.roleToSocket.P2.send(JSON.stringify({
          label: Labels.Win,
          payload: result[2]
        }))
        
        return this.end()
      }
      case Labels.Draw: {
        this.roleToSocket.P1.send(JSON.stringify({
          label: Labels.Draw,
          payload: result[1]
        }))

        this.roleToSocket.P2.send(JSON.stringify({
          label: Labels.Draw,
          payload: result[2]
        }))

        return this.end()
      }
      case Labels.Update: {
        this.roleToSocket.P1.send(JSON.stringify({
          label: Labels.Update,
          payload: result[1]
        }))

        this.roleToSocket.P2.send(JSON.stringify({
          label: Labels.Update,
          payload: result[2]
        }))

        break
      }
    }
  }

}