<template>
  <div>
    <div ref="container" class="absolute top-0 left-0" />
    <div class="absolute top-0 left-0 z-10 flex items-center">
      <input
        v-model.number="zoomLevel"
        type="range"
        min="0.1"
        max="5"
        step="0.1"
        class="m-2 ml-12"
        @change="drawStage"
      />
      <input
        v-model.number="gridSize"
        type="range"
        min="30"
        max="100"
        class="m-2 ml-12"
        @change="drawStage"
      />
      <input
        v-model.number="gridSize"
        type="number"
        min="30"
        max="100"
        class="p-px m-2 text-center text-black rounded-sm"
        @change="drawStage"
      />
      <input type="file" name="img" accept="image/*" @change="setMap" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import { Graphics, Application, Sprite, Loader } from 'pixi.js'
import defaultMap from '@/assets/images/dnd/map.png'
import dorwin from '@/assets/images/dnd/dorwin.png'
import { GameState, Token, Position } from '@/interfaces/GameState'
import { sleep } from '@/lib/utils'

const container: Ref<HTMLElement | null> = ref(null)

let map = defaultMap
let app: Application

let windowHeight = 0
let windowWidth = 0

let gridSize = ref(60)
let zoomLevel = ref(1)
let gameState: GameState

const loader = new Loader()

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
  loadToken()
  loadAssets()
})

const loadAssets = () => {
  loader.reset()
  loader.add('map', map)
  loader.add('dorwin', dorwin)
  loader.onComplete.add(drawStage)
  loader.load()
}

const loadToken = () => {
  gameState.tokens.push({
    image: dorwin,
    name: 'Dorwin',
    color: 0xeecc11,
    position: { x: 3, y: 3 },
  })
}

const setMap = (event: InputEvent) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length) {
    map = URL.createObjectURL(files[0] as Blob)
    loadAssets()
  }
}

const drawStage = async () => {
  clearStage()
  await drawMap()
  drawGrid()
  drawTokens()
}

const clearStage = () => {
  app.stage.removeChildren()
  app.stage.scale.x = zoomLevel.value
  app.stage.scale.y = zoomLevel.value // TODO: Fix
}

const drawMap = async () => {
  const bg = Sprite.from(map)
  const { height, width } = bg

  if (height === 1 || width === 1) {
    await sleep(50)
    await drawMap()
  } else {
    let scaleFactor = windowWidth / width
    if (height * scaleFactor > windowHeight) {
      scaleFactor = windowHeight / height
    }

    bg.height = height * scaleFactor
    bg.width = width * scaleFactor

    app.stage.addChild(bg)
  }
}

const drawGrid = () => {
  const grid = new Graphics()
  grid.lineStyle(2, 0x222, 0.5)

  let x = 0
  while (x < windowWidth) {
    x += gridSize.value
    grid.moveTo(x, 0)
    grid.lineTo(x, windowHeight)
  }

  let y = 0
  while (y < windowHeight) {
    y += gridSize.value
    grid.moveTo(0, y)
    grid.lineTo(windowWidth, y)
  }

  app.stage.addChild(grid)
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

  const makeCircleGraphic = (graphic: Graphics) => {
    graphic.drawCircle(0, 0, gridSize.value / 2 - 4)
    graphic.scale.x = 1 / tokenScale
    graphic.scale.y = 1 / tokenScale
    sprite.addChild(graphic)
  }

  const [mask, border] = [new Graphics(), new Graphics()]
  mask.beginFill(0x000000)
  sprite.mask = mask
  makeCircleGraphic(mask)

  border.lineStyle(4, token.color)
  makeCircleGraphic(border)

  const setMousePosScale = ({ x, y }: Position, scale?: number) => {
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
    const currentToken = gameState.tokens.find(
      (currentToken: Token) => token === currentToken
    )

    if (currentToken) {
      currentToken.position = index

      const pos = posIndexToVal(index)
      setMousePosScale(pos, 1)
    }
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
