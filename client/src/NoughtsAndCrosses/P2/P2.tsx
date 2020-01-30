import React from "react"
import { Constructor, Message, SendComponentFactory, ReceiveHandlerMap } from "../Runtime"
import { S31 } from "../P1/S31"
import { S34 } from "../P1/S34"
import { S32 } from "../P1/S32"
import { S33 } from "../P1/S33"
import { Roles, StateId, Labels } from "../Constants"
import { Coordinate as Point } from "./../Types"

type P = {
  endpoint: string,
  states: [Constructor<S31>,
           Constructor<S32>,
           Constructor<S33>,
           Constructor<S34>],
  waiting: JSX.Element
}

type EFSM = [StateId, JSX.Element]

type S = {
  ws: WebSocket,
  efsm?: EFSM,
  receiveHandler: ReceiveHandlerMap
}

export default class P2 extends React.Component<P, S> {

  constructor(props: P) {
    super(props)
    this.state = { ws: new WebSocket(props.endpoint), receiveHandler: {} }
    this._onReceiveInit = this._onReceiveInit.bind(this)
    this._onReceiveMsg = this._onReceiveMsg.bind(this)
  }

  componentDidMount() {
    this.state.ws.addEventListener('message', this._onReceiveInit)
    this.state.ws.addEventListener('open', () => this.state.ws.send(Message.connect(Roles.P2)))
  }

  private _onReceiveInit(ev: MessageEvent) {
    this.state.ws.removeEventListener('message', this._onReceiveInit)
    this.state.ws.addEventListener('message', this._onReceiveMsg)

    const Elem = this.props.states[3]
    this.setState({ efsm: [StateId.S34, <Elem register={this._register.bind(this)}/>] })
  }

  private _onReceiveMsg(ev: MessageEvent) {
    const message = JSON.parse(ev.data)

    // Advance state machine
    switch (this.state.efsm?.[0]) {
      case StateId.S33: {
        switch (message.label) {
          case Labels.Win:
          case Labels.Draw: {
            this.state.receiveHandler[message.label](message.payload as Point)
            const Elem = this.props.states[1]
            return this.setState({ efsm: [StateId.S32, <Elem />]})
          }
          case Labels.Update: {
            this.state.receiveHandler[message.label](message.payload as Point)
            const Elem = this.props.states[3]
            return this.setState({ efsm: [StateId.S34, <Elem register={this._register.bind(this)} /> ]})
          }
          default:
            // Should not get here
            return
        } 
      }

      case StateId.S34: {
        switch (message.label) {
          case Labels.Lose:
          case Labels.Draw: {
            this.state.receiveHandler[message.label](message.payload as Point)
            const Elem = this.props.states[1]
            return this.setState({ efsm: [StateId.S32, <Elem />]})
          }
          case Labels.Update: {
            this.state.receiveHandler[message.label](message.payload as Point)
            const Elem = this.props.states[0]
            return this.setState({ 
              efsm: [StateId.S31, <Elem Pos={this._buildSendElement<Point>('Pos').bind(this)} />]
            })
          }
          default:
            // Should not get here
            return
        }
      }
      default:
        // Should not get here
        return
    }

  }

  private _send(label: string, payload: any) {
    this.state.ws.send(Message.payload(label, payload))

    // Advance state machine
    switch (this.state.efsm?.[0]) {
      case StateId.S31:
        const Elem = this.props.states[2]
        return this.setState({
          efsm: [StateId.S33, <Elem register={this._register.bind(this)} />]
        })

      default:
        // Should not get here
    }
  }

  private _buildSendElement<T>(label: string): SendComponentFactory<T> {
    return (event: string, handler: (event: UIEvent) => T) => {
      const send = (payload: T) => this._send(label, payload)
      return class extends React.Component {
        render() {
          const children = React.Children.map(this.props.children, child => React.cloneElement(child as React.ReactElement<any>, {
            [`on${event}`]: (event: MouseEvent) => send(handler(event))
          }))
          return children   
        }
      }
    }
  }

  private _register(receiveHandler: ReceiveHandlerMap) {
    this.setState({ receiveHandler })
  }

  render() {
    return (this.state.efsm && this.state.efsm[1]) || this.props.waiting
  }

}