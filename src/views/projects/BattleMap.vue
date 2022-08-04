<template>
  <div>
    <div ref="container" class="absolute top-0 left-0" />
    <div class="absolute top-0 left-0 z-10">
      <input
        id="myRange"
        v-model.number="gridSize"
        type="range"
        min="10"
        max="100"
        class="slider"
        @change="drawStage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import { Graphics, Application, Sprite, Loader } from 'pixi.js'
import map from '@/assets/images/dnd/map.png'
import dorwin from '@/assets/images/dnd/dorwin.png'
import { GameState, Token, Position } from '@/interfaces/GameState'

const container: Ref<HTMLElement | null> = ref(null)

let app: Application

let windowHeight = 0
let windowWidth = 0

let gridSize = ref(50)

let gameState: GameState

onMounted(() => {
  windowHeight = window.innerHeight
  windowWidth = window.innerWidth

  app = new Application({
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 0xffffff,
    antialias: true,
  })

  gameState = { tokens: [] }

  container.value?.appendChild(app.view)

  const loader = new Loader()
  loader.add('map', map)
  loader.add('dorwin', dorwin)
  loader.onComplete.add(loadToken)
  loader.onComplete.add(drawStage)
  loader.load()
})

const loadToken = () => {
  gameState.tokens.push({
    image: dorwin,
    name: 'Dorwin',
    color: 0xeecc11,
    position: { x: 3, y: 3 },
  })
}

const drawStage = () => {
  clearStage()
  drawMap()
  drawGrid()
  drawTokens()
}

const clearStage = () => {
  let blank = new Graphics()
  blank.beginFill(0xffffff)
  blank.drawRect(0, 0, windowWidth, windowHeight)
  app.stage.addChild(blank)
}

const drawMap = () => {
  const bg = Sprite.from(map)
  const { height, width } = bg

  let scaleFactor = windowWidth / width

  if (height * scaleFactor > windowHeight) {
    scaleFactor = windowHeight / height
  }

  bg.height = height * scaleFactor
  bg.width = width * scaleFactor

  app.stage.addChild(bg)
}

const drawGrid = () => {
  const line = new Graphics()
  line.lineStyle(2, 0x444, 0.5)

  let x = 0
  while (x < windowWidth) {
    x += gridSize.value
    line.moveTo(x, 0)
    line.lineTo(x, windowHeight)
  }

  let y = 0
  while (y < windowHeight) {
    y += gridSize.value
    line.moveTo(0, y)
    line.lineTo(windowWidth, y)
  }

  app.stage.addChild(line)
}

const drawTokens = () => {
  gameState.tokens.forEach(drawToken)
}

const drawToken = (token: Token) => {
  const size = gridSize.value - 4
  let dragging = false
  const pos = posIndexToVal(token.position)

  const sprite = Sprite.from(token.image)
  sprite.anchor.set(0.5)
  sprite.width = size
  sprite.height = size
  sprite.x = pos.x
  sprite.y = pos.y
  sprite.interactive = true
  const tokenScale = sprite.scale.x

  const mask = new Graphics()
  mask.beginFill(0x000000)
  mask.drawCircle(0, 0, gridSize.value / 2 - 4)
  mask.scale.x = 1 / tokenScale
  mask.scale.y = 1 / tokenScale
  sprite.mask = mask
  sprite.addChild(mask)

  const border = new Graphics()
  border.lineStyle(4, token.color)
  border.drawCircle(0, 0, gridSize.value / 2 - 4)
  border.scale.x = 1 / tokenScale
  border.scale.y = 1 / tokenScale
  sprite.addChild(border)

  const setMousePosScale = ({ x, y }, scale?) => {
    sprite.x = x
    sprite.y = y
    if (scale) {
      sprite.scale.x = tokenScale * scale
      sprite.scale.y = tokenScale * scale
    }
  }

  sprite.on('pointerdown', (e) => {
    dragging = true
    setMousePosScale(e.data.global, 1.2)
  })

  sprite.on('pointermove', (e) => {
    if (dragging) {
      setMousePosScale(e.data.global)
    }
  })

  sprite.on('pointerup', (e) => {
    dragging = false

    const index = posValToIndex(e.data.global)
    gameState.tokens.find((_token: Token) => token === _token).position = index

    const pos = posIndexToVal(index)
    setMousePosScale(pos, 1)
  })

  app.stage.addChild(sprite)
}

const posIndexToVal = ({ x, y }: Position): Position => ({
  x: gridSize.value * x + gridSize.value / 2,
  y: gridSize.value * y + gridSize.value / 2,
})

const posValToIndex = ({ x, y }: Position): Position => ({
  x: Math.floor(x / gridSize.value),
  y: Math.floor(y / gridSize.value),
})
</script>

<style></style>
