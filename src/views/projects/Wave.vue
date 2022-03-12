<template>
  <div class="py-20 bg-img bg-img-cover">
    <div class="text-center">
      <h1 class="text-5xl mb-20 underline mx-auto font-semibold">Wave</h1>
      <div id="canvas" width="500" height="500"></div>
      <canvas id="c"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  setup() {
    const windowWidth = window.innerWidth
    const wave_height = 150, // Height of wave
      wave_shift = 0.02, // Alter how wave shifs
      ball_count = 75 // Number of balls in the wave

    const period_factor = windowWidth < 1200 ? (windowWidth < 500 ? 6 : 4) : 2 // Period Factor
    const ball_size = windowWidth / ball_count // How big should each ball be

    let count = 0 // This just keeps track of where we are in the wave formation
    let wave

    onMounted(() => {
      wave = document.getElementById('canvas')
      for (var i = 0; i < ball_count; i++) {
        var ball = document.createElement('div')
        ball.id = 'ball' + i
        ball.className = 'ball'
        ball.style.width = ball_size + 'px'
        ball.style.height = ball_size + 'px'
        ball.style.backgroundColor = '#fff'
        ball.style.left = i * ball_size + 'px'
        ball.style.top = wave_height / 2 - ball_size / 2 + 'px'

        wave.appendChild(ball)
      }

      move()
    })

    function move() {
      count++
      for (var i = 0; i < ball_count; i++) {
        var top =
          100 +
          (wave_height / 2) *
            (1 +
              Math.sin(
                (((count / period_factor) *
                  (i / (ball_size * ball_count) + wave_shift)) %
                  period_factor) *
                  Math.PI
              ))
        // console.log(top)
        var ball = document.getElementById('ball' + i)
        ball.style.top = top + 'px'
      }

      if (count == 2 * period_factor * (ball_size * ball_count)) {
        count = 0
      }

      requestAnimationFrame(move)
    }
  },
}
</script>

<style>
#canvas {
  position: relative;
  margin: 0 auto;
  /* margin-top: 50px; */
}
#canvas .ball {
  background-color: #666;
  display: inline-block;
  float: left;
  border-radius: 50%;
  position: absolute;
}
</style>
<style scoped>
.bg-img {
  background-image: url('@/assets/images/backgrounds/wave.svg');
}
</style>
