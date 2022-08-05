export type Position = { x: number; y: number }

export interface Token {
  position: Position
  name: string
  image: string
  color: number
}

export interface GameState {
  tokens: Token[]
}
