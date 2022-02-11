<template>
  <div class="-mt-10">
    <div id="back">
      <!-- <a href="/index.html"> &lt; back</a> -->
    </div>
    <div id="container">
      <canvas id="myCanvas" width="1000" height="1000"></canvas>
      <div id="show">
        <button @click="toggleSound">Quiet</button>
        <button @click="reset" id="reset">Reset</button>
        <button @click="showSettings" id="showbutton">Show</button>
      </div>
      <div id="controls" ref="controls">
        <form method="post">
          <div class="control">
            <label for="rainbow">Rainbow:</label>
            <input
              type="checkbox"
              name="rainbow"
              class="input"
              id="rainbow"
              v-model="settings.rainbow"
            />
          </div>
          <div class="control">
            <label for="random">Random:</label>
            <input
              type="checkbox"
              name="random"
              class="input"
              id="random"
              v-model="settings.random"
            />
          </div>
          <div class="control">
            <label for="fgcolor">Rain Color:</label>
            <input
              type="color"
              name="fgcolor"
              class="color input"
              id="fg"
              v-model="settings.fg"
            />
          </div>
          <div class="control">
            <label for="bgcolor">Sky Color:</label>
            <input
              type="color"
              name="bgcolor"
              class="color input"
              id="bg"
              v-model="settings.bg"
            />
          </div>
          <label for="speed">Speed:</label>
          <input
            type="range"
            name="speed"
            id="speed"
            v-model="settings.speed"
            min="0"
            max="20"
          />
          <label for="density">Density:</label>
          <input
            type="range"
            name="density"
            id="density"
            v-model="settings.density"
            min="1"
            max="30"
          />
          <label for="width">Width:</label>
          <input
            type="range"
            name="width"
            id="width"
            v-model="settings.width"
            min="0"
            max="10"
          />
          <label for="length">Length:</label>
          <input
            type="range"
            name="length"
            id="length"
            v-model="settings.length"
            min="0"
            max="200"
          />
        </form>
      </div>
    </div>
    <iframe
      width="1424"
      height="620"
      src="https://www.youtube.com/embed/q76bMs-NwRk?autoplay=1&enablejsapi=1"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      style="display: none"
      id="rain-video"
    ></iframe>
  </div>
</template>

<script>
import { onMounted, reactive, ref, inject, watch } from 'vue'
import invert from 'invert-color'

export default {
  setup() {
    let canvas
    let gl
    let playSounds = true

    const settings = reactive({
      rainbow: false,
      random: false,
      fg: '#000',
      bg: '#fff',
      speed: 6,
      density: 8,
      width: 4,
      length: 60,
    })

    const reset = () => {
      settings.rainbow = false
      settings.random = false
      settings.fg = dark.value ? '#fff' : '#000'
      settings.bg = dark.value ? '#171717' : '#fff'
      settings.speed = 6
      settings.density = 8
      settings.width = 4
      settings.length = 60
    }

    const toggleSound = () => {
      let func = 'pauseVideo'
      if (playSounds) {
        playSounds = false
      } else {
        playSounds = true
        func = 'playVideo'
      }

      document
        .getElementById('rain-video')
        .contentWindow.postMessage(
          `{"event":"command","func":"${func}","args":""}`,
          '*'
        )
    }

    window.requestAnimationFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60)
        }
      )
    })()

    const dark = inject('dark', false)

    watch(dark, () => {
      settings.fg = invert(settings.fg)
      settings.bg = invert(settings.bg)
    })

    onMounted(() => {
      canvas = document.getElementById('myCanvas')
      gl = initWebGL()
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

    // create a drop and insert into drop array
    function makeDrop(drops, count) {
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
    function drawLine(drop) {
      gl.beginPath()
      gl.moveTo(drop.x, drop.y)
      gl.lineTo(drop.x, drop.y + drop.l)
      gl.lineWidth = drop.w
      gl.strokeStyle = drop.c
      gl.stroke()
    }

    function drawLines(drops) {
      for (let i in drops) {
        drawLine(drops[i])
      }
    }

    // update the positions of all the drops
    function updateDrops(drops, time) {
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
    function animate(drops, startTime, prevTime, lastSpawn, count) {
      var elapsedTime = new Date().getTime() - startTime

      // time since the previous loop started
      var deltaTime = elapsedTime - prevTime

      drops = updateDrops(drops, deltaTime)

      gl.fillStyle = settings.bg
      gl.fillRect(0, 0, canvas.width, canvas.height)

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
      controls.value.style.right = controlsHidden ? '20px' : '-200px'
      controlsHidden = !controlsHidden
    }

    return {
      settings,
      controls,
      toggleSound,
      showSettings,
      reset,
    }
  },
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
canvas {
  height: 100vh;
  width: 100vw;
  display: block;
  position: absolute;
}
#container {
  position: relative;
  height: 100vh;
  width: 100vw;
}
#show {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
#reset {
  float: left;
  // display: none;
  position: absolute;
  right: 50px;
}
#controls {
  position: absolute;
  bottom: 40px;
  right: -200px;
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
