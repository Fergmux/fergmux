<template>
  <div class="w-full p-10 pt-16 md:p-20 bg-img bg-img-cover">
    <div class="max-w-screen-lg m-auto">
      <h1 class="mb-16 header-main">Chess</h1>
      <div v-if="!gameToken" class="justify-between max-w-screen-md md:flex">
        <div class="drop-shadow-3xl">
          <h1 class="mb-5 text-2xl font-semibold">Start a new game</h1>
          <p class="mb-2 text-lg">I want to play as:</p>
          <div>
            <div class="my-2 form-check">
              <input
                class="mt-1 mr-2 radio"
                type="radio"
                name="color"
                id="color-white"
                value="white"
                checked
                v-model="playerColor"
              />
              <label
                class="inline-block font-semibold form-check-label"
                for="color-white"
              >
                White
              </label>
            </div>
            <div class="my-2 form-check">
              <input
                class="mt-1 mr-2 radio"
                type="radio"
                name="color"
                id="color-black"
                value="black"
                v-model="playerColor"
              />
              <label
                class="inline-block font-semibold form-check-label"
                for="color-black"
              >
                Black
              </label>
            </div>
          </div>
          <button @click="createGame" class="block mt-5 button-light">
            Create game
          </button>
        </div>
        <div>
          <h1 class="mt-10 mb-5 text-2xl font-semibold md:mt-0 drop-shadow-3xl">
            Join a game
          </h1>
          <input
            v-model="gameToken"
            placeholder="Game ID"
            class="block text-field"
          />
          <button @click="joinGame" class="block mt-5 button-light">
            Join game
          </button>
        </div>
      </div>
      <div v-if="gameToken" class="drop-shadow-3xl">
        <p class="mb-5 drop-shadow-3xl">
          Game ID: <span class="font-bold">{{ gameToken }}</span>
        </p>
        <button @click="newGame" class="mr-5 button-light">New game</button>
        <button @click="copyLink" class="button-light">Copy link</button>
        <p class="mt-10 mb-5">
          <template v-if="playerColor">
            It is {{ playerTurn ? 'your' : 'their' }} turn.
          </template>
          <template v-else>
            You are watching {{ colorTurn }} take their turn.
          </template>
        </p>
      </div>
      <div class="drop-shadow-3xl" ref="board"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { _62To10, _10To62 } from 'simple-base-converter'
import { Application, Graphics, Sprite } from 'pixi.js'
import { Chess } from 'chess.js'
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

let chess
let moves
let stream
let app

const gameId = ref(null)
const colorTurn = ref(null)
const playerColor = ref('white')
const playerTurn = computed(() => colorTurn.value === playerColor.value)
const gameToken = computed(() => gameId.value && _10To62(gameId.value))

const copyLink = () => {
  navigator.clipboard.writeText(
    `${window.location.origin}/#/projects/chess/${gameToken.value}`
  )
  toast('Link copied to clipboard')
}

const newGame = () => {
  board.value.removeChild(app.view)
  stream.close()

  gameId.value = null
  chess = null
  moves = null
  stream = null

  router.push({ name: 'chess' })
}

const createGame = async () => {
  const response = await api.post('/.netlify/functions/create-game', {
    [playerColor.value]: playerId.value,
  })

  gameId.value = response.gameId

  startStream()

  router.push({
    name: 'chess',
    params: { id: gameToken.value },
  })
}

const joinGame = async () => {
  const response = await api.post('/.netlify/functions/join-game', gameId.value)

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
    game: { fen: chess.fen(), moves },
  })
}

const startStream = (fen, moves) => {
  initGame(fen, moves)

  stream = client.stream
    .document(q.Ref(q.Collection('games'), gameId.value))
    .on('version', (version) => {
      applyMove(version.document.data.moves)
    })
    .start()

  drawBoard()
}

const applyMove = (newMoves) => {
  newMoves.slice(moves.length).forEach((move) => {
    chess.move(move)
    moves.push(move)
    drawBoard()
  })
}

const route = useRoute()
const router = useRouter()
const playerId = ref(null)

onMounted(() => {
  playerId.value = window.localStorage.getItem('playerId')

  if (!playerId.value) {
    playerId.value = Date.now().toString()
    window.localStorage.setItem('playerId', playerId.value)
  }

  if (route.params.id) {
    gameId.value = _62To10(route.params.id)
    joinGame()
  }
})

// PIXI //
const boardSize = Math.min(window.innerWidth / 2, 300)
const tileSize = boardSize / 8

const initGame = (fen, _moves) => {
  app = new Application({
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    width: boardSize,
    height: boardSize,
  })

  board.value.appendChild(app.view)

  chess = new Chess(fen)
  moves = _moves || []

  drawBoard()
}

const board = ref(null)
const colors = {
  tile: { black: '0x3B4B66', white: '0x7Bb8c5', selected: '0x886644' },
  piece: { black: '0x000000' },
}

const drawBoard = () => {
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
    row.forEach((piece, columnIndex) => {
      drawTile(columnIndex, rowIndex)

      if (piece) {
        drawPiece(piece, columnIndex, rowIndex)
      }
    })
  })
}

const drawTile = (x, y) => {
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

  tile.on('pointertap', tileClick)
  tile.interactive = true

  app.stage.addChild(tile)
}

const drawPiece = (piece, x, y) => {
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

let selectedTile = { x: null, y: null, name: null }

const tileClick = (e) => {
  if (!playerTurn.value || chess.game_over()) return

  const x = Math.floor(e.data.global.x / tileSize)
  const y = Math.floor(e.data.global.y / tileSize)
  const clickedTile = 'abcdefgh'[x] + (8 - y)

  if (selectedTile.name) {
    const move = chess.move({ from: selectedTile.name, to: clickedTile })
    if (move) {
      moves.push(move)
      sendMove()
      selectedTile = { x: null, y: null, name: null }
    } else {
      selectedTile = { x: null, y: null, name: null }
    }
  } else {
    if (
      chess.get(clickedTile).color ===
      Object.keys(colorMap).find((key) => colorMap[key] === playerColor.value)
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
