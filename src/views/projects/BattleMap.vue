<template>
  <div>
    <div ref="container" class="absolute top-0 left-0" />
    <div class="absolute top-0 left-0 z-10">
      <button class="bg-slate-500">Fuck me in my ass you fat fuck</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import { Graphics, Application, Sprite } from 'pixi.js'
import map from '@/assets/images/dnd/map.avif'

const container: Ref<HTMLElement | null> = ref(null)

let app: Application

let windowHeight = 0
let windowWidth = 0

let gridSize = ref(50)

onMounted(() => {
  windowHeight = window.innerHeight
  windowWidth = window.innerWidth
  app = new Application({
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 0xffffff,
  })
  container.value?.appendChild(app.view)
  drawMap()
  drawGrid()
})

const drawMap = () => {
  let bg = Sprite.from('assets/image.png')
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
</script>

<style></style>
