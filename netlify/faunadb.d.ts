export interface Subscription<TEventHandlerMap> {
  on: <T extends keyof TEventHandlerMap>(
    type: T,
    callback: TEventHandlerMap[T]
  ) => this
  start: () => this
  close: () => void
}

export type Handler<TEventType extends string, TEventData> = (
  data: TEventData,
  event: {
    type: TEventType
    event: TEventData
    txn?: number
  }
) => void

export type SubscriptionEventHandlers = {
  start: Handler<'start', number>
  error: Handler<'error', unknown>
  version: Handler<
    'version',
    {
      action: 'create' | 'update' | 'delete'
      document?: object
      diff?: object
      prev?: object
    }
  >
  set: Handler<
    'set',
    {
      action: 'add' | 'remove'
      document?: object
      index?: object
    }
  >
  history_rewrite: Handler<
    'history_rewrite',
    {
      action: 'history_rewrite'
      document: object
    }
  >
  snapshot: Handler<'snapshot', object>
}
export class Expr {
  constructor(obj: object)

  readonly _isFaunaExpr?: boolean
  toFQL(): string
  static toString(expr: Expr): string
}
export class Value extends Expr {
  toJSON(): object
  inspect(): string

  readonly _isFaunaValue?: boolean
}
export class Ref extends Value {
  constructor(id: string, col?: Ref, db?: Ref)

  id: string
  collection?: Ref
  class?: Ref
  database?: Ref

  readonly _isFaunaRef?: boolean
}

export type FaunaDocument<T = object> = {
  ref: Ref
  ts: number
  data: T
  secret?: string
}
