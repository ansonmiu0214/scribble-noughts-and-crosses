import { Component } from 'react'
import { Roles } from './Constants'

export type Constructor<T> = new (...args: any[]) => T
export function AsModelType<T extends React.Component>(component: unknown): Constructor<T> { return component as Constructor<T> }
export type SendComponentFactory<Payload> = (event: string, handler: (event: UIEvent) => Payload) => Constructor<Component>
export type ReceiveHandler<T> = (payload: T) => void
export type ReceiveHandlerMap = { [label: string]: ReceiveHandler<any> }

export class Message {
  static connect(role: Roles): string {
    return JSON.stringify({ connect: role })
  }

  static payload(label: string, ...payload: any[]): string {
    return JSON.stringify({ label, payload })
  }

  static end(role: Roles): string {
    return JSON.stringify({ end: role })
  }
}