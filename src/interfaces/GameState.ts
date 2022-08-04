export type Position = [number, number]

export interface Token {
  position: Position
  name: string
  image: string
}

export interface GameState {
  tokens: Token[]
}
