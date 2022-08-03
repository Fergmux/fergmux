// TODO REMOVE THIS FILE ONCE FAUNA UPDATES THERE TYPE EXPORTS

export {}

declare global {
  interface Subscription<TEventHandlerMap> {
    on: <T extends keyof TEventHandlerMap>(
      type: T,
      callback: TEventHandlerMap[T]
    ) => this
    start: () => this
    close: () => void
  }

  type Handler<TEventType extends string, TEventData> = (
    data: TEventData,
    event: {
      type: TEventType
      event: TEventData
      txn?: number
    }
  ) => void

  type SubscriptionEventHandlers = {
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
  class Expr {
    constructor(obj: object)

    readonly _isFaunaExpr?: boolean
    toFQL(): string
    static toString(expr: Expr): string
  }
  class Value extends Expr {
    toJSON(): object
    inspect(): string

    readonly _isFaunaValue?: boolean
  }
  class Ref extends Value {
    constructor(id: string, col?: Ref, db?: Ref)

    id: string
    collection?: Ref
    class?: Ref
    database?: Ref

    readonly _isFaunaRef?: boolean
  }

  type FaunaDocument<T = object> = {
    ref: Ref
    ts: number
    data: T
    secret?: string
  }
}
