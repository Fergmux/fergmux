<template>
  <div>
    <div id="canvas" width="500" height="500"></div>
    <canvas id="c"></canvas>
  </div>
</template>

<script>
import { onMounted, watch, inject } from 'vue'

export default {
  setup() {
    const wave_height = 150, // Height of wave
      wave_shift = 0.02, // Alter how wave shifs
      ball_count = 75, // Number of balls in the wave
      ball_size = 20, // How big should each ball be
      base_color = '#000', // Base color for balls
      light_color = '#fff', // Light color for balls
      period_factor = 2 // Period Factor

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
        ball.style.backgroundColor = base_color
        ball.style.left = i * ball_size + 'px'
        ball.style.top = wave_height / 2 - ball_size / 2 + 'px'

        wave.appendChild(ball)
      }

      move()
    })

    const dark = inject('dark', false)

    watch(dark, (dark) => {
      for (var i = 0; i < ball_count; i++) {
        var ball = document.getElementById('ball' + i)
        ball.style.backgroundColor = dark ? light_color : base_color
      }
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
