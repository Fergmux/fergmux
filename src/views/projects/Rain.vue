<template>
  <div>
    <div>
      <canvas id="myCanvas" ref="canvasRef"></canvas>
      <div id="show">
        <button @click="toggleSound">
          {{ playSounds ? 'Quiet' : 'Sound' }}
        </button>
        <button id="reset" @click="reset">Reset</button>
        <button id="showbutton" @click="showSettings">Show</button>
      </div>
      <div id="controls" ref="controls">
        <form method="post">
          <div class="control">
            <label for="rainbow">Rainbow:</label>
            <input
              id="rainbow"
              v-model="settings.rainbow"
              type="checkbox"
              name="rainbow"
              class="input"
            />
          </div>
          <div class="control">
            <label for="random">Random:</label>
            <input
              id="random"
              v-model="settings.random"
              type="checkbox"
              name="random"
              class="input"
            />
          </div>
          <div class="control">
            <label for="fgcolor">Rain Color:</label>
            <input
              id="fg"
              v-model="settings.fg"
              type="color"
              name="fgcolor"
              class="color input"
            />
          </div>
          <div class="control">
            <label for="bgcolor">Sky Color:</label>
            <input
              id="bg"
              v-model="settings.bg"
              type="color"
              name="bgcolor"
              class="color input"
            />
          </div>
          <label for="speed">Speed:</label>
          <input
            id="speed"
            v-model="settings.speed"
            type="range"
            name="speed"
            min="0"
            max="20"
          />
          <label for="density">Density:</label>
          <input
            id="density"
            v-model="settings.density"
            type="range"
            name="density"
            min="1"
            max="30"
          />
          <label for="width">Width:</label>
          <input
            id="width"
            v-model="settings.width"
            type="range"
            name="width"
            min="0"
            max="10"
          />
          <label for="length">Length:</label>
          <input
            id="length"
            v-model="settings.length"
            type="range"
            name="length"
            min="0"
            max="200"
          />
        </form>
      </div>
    </div>
    <iframe
      id="rain-video"
      width="20"
      height="20"
      src="https://www.youtube.com/embed/q76bMs-NwRk?enablejsapi=1"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      style="display: none; position: absolute; top: 0; left: 0; z-index: -1"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'

let canvas: HTMLCanvasElement
let gl: CanvasRenderingContext2D | null
const playSounds = ref(false)
const canvasRef = ref()

const settings = reactive({
  rainbow: false,
  random: false,
  bg: '#000',
  fg: '#fff',
  speed: 6,
  density: 8,
  width: 4,
  length: 60,
})

const reset = () => {
  settings.rainbow = false
  settings.random = false
  settings.fg = '#fff'
  settings.bg = '#000'
  settings.speed = 6
  settings.density = 8
  settings.width = 4
  settings.length = 60
}

const toggleSound = () => {
  let func = 'pauseVideo'
  if (playSounds.value) {
    playSounds.value = false
  } else {
    playSounds.value = true
    func = 'playVideo'
  }

  const iFrame = document?.getElementById('rain-video') as HTMLIFrameElement
  if (iFrame) {
    iFrame.contentWindow?.postMessage(
      `{"event":"command","func":"${func}","args":""}`,
      '*'
    )
  }
}

window.requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
  )
})()

onMounted(() => {
  canvas = document.getElementById('myCanvas') as HTMLCanvasElement
  gl = initWebGL()
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  reset()
})

function initWebGL() {
  gl = null
  // Try to grab the standard context. If it fails, fallback to experimental.
  gl = canvas.getContext('2d')
  // If we don't have a GL context, give up now
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.')
  }
  return gl
}

interface Drop {
  x: number
  y: number
  w: number
  l: number
  v: number
  c: string
}
// create a drop and insert into drop array
function makeDrop(drops: Drop[], count: number) {
  var randVals = []
  var width = Number(settings.width)
  var length = Number(settings.length)

  let col
  for (var i = 0; i < 6; i++) {
    randVals.push(Math.random())
  }
  if (settings.random) {
    var c3 = Math.floor(randVals[3] * 256).toString()
    var c4 = Math.floor(randVals[4] * 256).toString()
    var c5 = Math.floor(randVals[5] * 256).toString()
    col = 'rgb(' + c3 + ', ' + c4 + ', ' + c5 + ')'
  } else if (settings.rainbow) {
    col = 'hsl(' + count.toString() + ', 100%, 50%)'
  } else {
    col = settings.fg
  }
  var drop = {
    x: randVals[0] * canvas.width,
    y: -400,
    w: randVals[1] * width,
    l: randVals[2] * length + length,
    v: randVals[1] / 2 + 0.5,
    c: col,
  }
  drops.push(drop)
  return drops
}

// draw a line passing in a drop object
function drawLine(drop: Drop) {
  if (gl) {
    gl.beginPath()
    gl.moveTo(drop.x, drop.y)
    gl.lineTo(drop.x, drop.y + drop.l)
    gl.lineWidth = drop.w
    gl.strokeStyle = drop.c
    gl.stroke()
  }
}

function drawLines(drops: Drop[]) {
  for (let i in drops) {
    drawLine(drops[i])
  }
}

// update the positions of all the drops
function updateDrops(drops: Drop[], time: number) {
  var liveDrops = []
  var speed = Number(settings.speed)
  for (let i in drops) {
    var drop = drops[i]
    drop.y = drop.y + (drop.v * time * speed) / 10
    if (drop.y < canvas.height) {
      liveDrops.push(drop)
    }
  }
  return liveDrops
}

// used to fit the density slider values to useful fractions of a second for drop creation
var incs = [1, 2, 5, 20, 50, 200, 500]
function animate(
  drops: Drop[],
  startTime: number,
  prevTime: number,
  lastSpawn: number,
  count: number
) {
  var elapsedTime = new Date().getTime() - startTime

  // time since the previous loop started
  var deltaTime = elapsedTime - prevTime

  drops = updateDrops(drops, deltaTime)

  if (gl) {
    gl.fillStyle = settings.bg
    gl.fillRect(0, 0, canvas.width, canvas.height)
  }

  drawLines(drops)

  // console.log(elapsedTime % 50)

  var density = Number(settings.density)

  // value on the density slider to switch from less than one to multiple drops per loop
  var switchPoint = 7

  // time since the last drop was created
  var timeSince = elapsedTime - lastSpawn

  // if density is less than one per animation loop, create drops at some rate
  if (density < switchPoint && timeSince > 1000 / incs[density]) {
    drops = makeDrop(drops, count)
    lastSpawn = elapsedTime
  } else if (density >= switchPoint) {
    // else make multiple drops each animation loop
    var dropCount = density - switchPoint + 1
    for (var i = 0; i < dropCount; i++) {
      drops = makeDrop(drops, count)
    }
    lastSpawn = elapsedTime
  }

  count++

  // request new frame
  window.requestAnimationFrame(function () {
    animate(drops, startTime, elapsedTime, lastSpawn, count)
  })
}

// wait one second before starting animation
setTimeout(function () {
  var startTime = new Date().getTime()
  animate([], startTime, startTime, 0, 0)
}, 1000)

const controls = ref()
let controlsHidden = true

const showSettings = () => {
  controls.value.style.display = controlsHidden ? 'block' : 'none'
  controlsHidden = !controlsHidden
}
</script>

<style lang="scss" scoped>
body {
  margin: 0px;
  padding: 0px;
  background-color: #050505;
  font-family: arial;
  color: #aaa;
  font-size: 12px;
  overflow: hidden;
}
#show {
  position: absolute;
  bottom: 5px;
  right: 25px;
  display: flex;

  > button {
    margin-left: 5px;
  }
}
#controls {
  position: absolute;
  bottom: 40px;
  right: 20px;
  display: none;
  z-index: 20;
}
#back {
  position: fixed;
  top: 0px;
  left: 0px;
  font-size: 16px;
  z-index: 1;
}
#back > a {
  color: #999;
}
button {
  background-color: rgba(111, 111, 111, 0.2);
  text-decoration: none;
  color: #aaa;
  border: none;
  display: block;
}
button:focus {
  outline: 0;
}
input {
  display: block;
}
.color::-webkit-color-swatch-wrapper {
  padding: 0;
}
.color::-webkit-color-swatch {
  border: none;
}
.color {
  display: block;
  width: 25px;
  height: 15px;
  border: 1px solid #777;
  border-radius: 2px;
  padding: 0px;
}
div.control {
  margin-bottom: 5px;
}
input.input {
  float: right;
}
</style>
