<template>
  <div class="bg-img bg-img-cover w-full p-10 pt-16 md:p-20">
    <div class="m-auto max-w-screen-lg">
      <h1 class="header-main mb-16">Chess</h1>
      <div v-if="!gameToken" class="max-w-screen-md justify-between md:flex">
        <div class="drop-shadow-3xl">
          <h1 class="mb-5 text-2xl font-semibold">Start a new game</h1>
          <p class="mb-2 text-lg">I want to play as:</p>
          <div>
            <div class="form-check my-2">
              <input
                id="color-white"
                v-model="playerColor"
                class="radio mr-2 mt-1"
                type="radio"
                name="color"
                value="white"
                checked
              />
              <label
                class="form-check-label inline-block font-semibold"
                for="color-white"
              >
                White
              </label>
            </div>
            <div class="form-check my-2">
              <input
                id="color-black"
                v-model="playerColor"
                class="radio mr-2 mt-1"
                type="radio"
                name="color"
                value="black"
              />
              <label
                class="form-check-label inline-block font-semibold"
                for="color-black"
              >
                Black
              </label>
            </div>
          </div>
          <button class="button-light mt-5 block" @click="createGame">
            Create game
          </button>
        </div>
        <div>
          <h1 class="mb-5 mt-10 text-2xl font-semibold drop-shadow-3xl md:mt-0">
            Join a game
          </h1>
          <input
            v-model="gameToken"
            placeholder="Game ID"
            class="text-field block"
          />
          <button class="button-light mt-5 block" @click="joinGame">
            Join game
          </button>
        </div>
      </div>
      <div v-if="gameToken" class="drop-shadow-3xl">
        <p class="mb-5 drop-shadow-3xl">
          Game ID: <span class="font-bold">{{ gameToken }}</span>
        </p>
        <button class="button-light mr-5" @click="newGame">New game</button>
        <button class="button-light" @click="copyLink">Copy link</button>
        <p class="mb-5 mt-10">
          <template v-if="playerColor">
            It is {{ playerTurn ? 'your' : 'their' }} turn.
          </template>
          <template v-else>
            You are watching {{ colorTurn }} take their turn.
          </template>
        </p>
      </div>
      <div ref="board" class="drop-shadow-3xl"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { _62To10, _10To62 } from 'simple-base-converter'
import { Application, Graphics, Sprite, InteractionEvent } from 'pixi.js'
import { ChessInstance, Move, PieceType, Square } from 'chess.js'
import { useToast } from '@/composables/toast'
import { client, q } from '@/lib/fauna'
import api from '@/lib/api'

import rook from '@/assets/images/chess/rook.png'
import pawn from '@/assets/images/chess/pawn.png'
import queen from '@/assets/images/chess/queen.png'
import king from '@/assets/images/chess/king.png'
import bishop from '@/assets/images/chess/bishop.png'
import knight from '@/assets/images/chess/knight.png'

const pieceMap = {
  n: knight,
  b: bishop,
  r: rook,
  q: queen,
  k: king,
  p: pawn,
}

const colorMap = { w: 'white', b: 'black' }

const { toast } = useToast()

let chess: ChessInstance | null
let moves: Move[]
let stream: Subscription<SubscriptionEventHandlers> | null
let app: Application

const gameId: Ref<string | null> = ref(null)
const colorTurn: Ref<string | null> = ref(null)
const playerColor: Ref<string | null> = ref('white')
const playerTurn = computed(() => colorTurn.value === playerColor.value)
const gameToken = computed(() => gameId.value && _10To62(gameId.value))

const copyLink = () => {
  navigator.clipboard.writeText(
    `${window.location.origin}/#/projects/chess/${gameToken.value}`
  )
  toast('Link copied to clipboard')
}

const board: Ref<HTMLElement | null> = ref(null)

const newGame = () => {
  if (board.value && stream) {
    board.value.removeChild(app.view)
    stream.close()

    gameId.value = null
    chess = null
    moves = []
    stream = null

    router.push({ name: 'chess' })
  }
}

const createGame = async () => {
  if (playerColor.value) {
    const response = await api.post('/.netlify/functions/create-chess-game', {
      [playerColor.value]: playerId.value,
    })

    gameId.value = response.gameId
  }

  startStream()

  router.push({
    name: 'chess',
    params: { id: gameToken.value },
  })
}

const joinGame = async () => {
  const response = await api.post(
    '/.netlify/functions/join-chess-game',
    gameId.value
  )

  const { fen, moves, black, white } = response

  if (playerId.value === white) {
    playerColor.value = 'white' // Existing white player
  } else if (playerId.value === black) {
    playerColor.value = 'black' // Existing black player
  } else if (white) {
    if (black) {
      playerColor.value = null // Spectator
    } else {
      playerColor.value = 'black' // New black player
    }
  } else {
    playerColor.value = 'white' // New white player
  }

  if (playerColor.value) {
    api.post('/.netlify/functions/send-move', {
      id: gameId.value,
      game: { [playerColor.value]: playerId.value },
    })
  }

  startStream(fen, moves)
}

const sendMove = async () => {
  await api.post('/.netlify/functions/send-move', {
    id: gameId.value,
    game: { fen: chess?.fen(), moves },
  })
}

interface gameDBObject {
  fen: string
  moves: Move[]
  white: string
  black: string
}

const startStream = (fen?: string, moves?: Move[]) => {
  initGame(fen, moves)

  if (gameId.value) {
    stream = client.stream
      .document(q.Ref(q.Collection('games'), gameId.value))
      .on('version', (version) => {
        const document = version?.document as FaunaDocument
        const data = document.data as gameDBObject
        applyMove(data.moves)
      })
      .start()
  }

  drawBoard()
}

const applyMove = (newMoves: Move[]) => {
  newMoves.slice(moves.length).forEach((move) => {
    if (chess) {
      chess.move(move)
      moves.push(move)
      drawBoard()
    }
  })
}

const route = useRoute()
const router = useRouter()
const playerId: Ref<string | null> = ref(null)

onMounted(() => {
  playerId.value = window.localStorage.getItem('playerId') as string

  if (!playerId.value) {
    playerId.value = Date.now().toString()
    window.localStorage.setItem('playerId', playerId.value)
  }

  if (route.params.id) {
    gameId.value = _62To10(route.params.id as string)
    joinGame()
  }
})

// PIXI //
const boardSize = Math.min(window.innerWidth / 2, 300)
const tileSize = boardSize / 8

const initGame = async (fen?: string, _moves?: Move[]) => {
  app = new Application({
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    width: boardSize,
    height: boardSize,
  })

  if (board.value) {
    board.value.appendChild(app.view)
  }

  const { Chess } = await import('chess.js')
  chess = new Chess(fen)
  moves = _moves || []

  drawBoard()
}

const colors = {
  tile: { black: 0x3b4b66, white: 0x7bb8c5, selected: 0x886644 },
  piece: { black: 0x000000 },
}

type PieceColor = 'b' | 'w'

interface Piece {
  type: PieceType
  color: PieceColor
}

const drawBoard = () => {
  if (!chess) return
  colorTurn.value = colorMap[chess.turn()]
  if (chess.in_check()) {
    toast('Check!')
  }
  if (chess.in_draw()) {
    toast('Draw!')
  }
  if (chess.in_stalemate()) {
    toast('Stalemate!')
  }
  if (chess.in_checkmate()) {
    if (playerTurn.value) {
      toast('Checkmate - You lose!')
    } else {
      toast('Checkmate - You win!')
    }
  }

  chess.board().forEach((row, rowIndex) => {
    row.forEach((piece: Piece | null, columnIndex) => {
      drawTile(columnIndex, rowIndex)

      if (piece) {
        drawPiece(piece, columnIndex, rowIndex)
      }
    })
  })
}

// OVerride default Graphics type because it is missing some DisplayObject properties
interface _Graphics extends Graphics {
  interactive: boolean
  on: (event: string, callback: (e: InteractionEvent) => void) => void
}

const drawTile = (x: number, y: number) => {
  const tile = new Graphics()

  let color = (x + y) % 2 ? colors.tile.black : colors.tile.white

  if (x === selectedTile.x && y === selectedTile.y) {
    color = colors.tile.selected
  }

  tile.beginFill(color)
  tile.drawRect(0, 0, tileSize, tileSize)
  tile.endFill()

  tile.x = x * tileSize
  tile.y = y * tileSize
  ;(tile as _Graphics).on('pointertap', tileClick)
  ;(tile as _Graphics).interactive = true

  app.stage.addChild(tile)
}

const drawPiece = (piece: Piece, x: number, y: number) => {
  const sprite = Sprite.from(pieceMap[piece.type])

  sprite.anchor.set(0.5)
  if (piece.color === 'b') {
    sprite.tint = colors.piece.black
  }

  // setting it to "the middle of the screen
  sprite.x = tileSize * x + tileSize / 2
  sprite.y = tileSize * y + tileSize / 2
  sprite.width = tileSize - 10
  sprite.height = tileSize - 10

  app.stage.addChild(sprite)
}

interface Tile {
  x: number | null
  y: number | null
  name: Square | null
}

let selectedTile: Tile = { x: null, y: null, name: null }

const tileClick = (e: InteractionEvent) => {
  if (!playerTurn.value || chess?.game_over()) return

  const x = Math.floor(e.data.global.x / tileSize)
  const y = Math.floor(e.data.global.y / tileSize)
  const clickedTile: Square = ('abcdefgh'[x] + (8 - y)) as Square

  if (selectedTile.name) {
    const move = chess?.move({ from: selectedTile.name, to: clickedTile })
    if (move) {
      moves.push(move)
      sendMove()
      selectedTile = { x: null, y: null, name: null }
    } else {
      selectedTile = { x: null, y: null, name: null }
    }
  } else {
    if (
      chess?.get(clickedTile)?.color ===
      Object.keys(colorMap).find(
        (key: string) => colorMap[key as PieceColor] === playerColor.value
      )
    ) {
      selectedTile = { x, y, name: clickedTile }
    }
  }
  drawBoard()
}
</script>

<style lang="scss" scoped>
.bg-img {
  background-image: url('@/assets/images/backgrounds/lines.svg');
}
</style>
