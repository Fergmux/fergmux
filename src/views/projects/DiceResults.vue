<template>
  <div class="bg-img bg-img-cover min-h-screen">
    <div class="flex flex-col items-center pt-20">
      <h1 class="mb-10 text-5xl font-semibold underline">Dice results</h1>
      <div class="flex w-full max-w-3xl flex-col items-center">
        <div class="mb-5 flex items-start text-center">
          Distribution when you roll a
          <span class="ml-2">
            <input
              id="dice"
              v-model="dice"
              type="number"
              min="1"
              max="30"
              class="bg-slate-600"
            />
            d<select id="sides" v-model="sides" class="bg-slate-600">
              <option :value="4">4</option>
              <option :value="6">6</option>
              <option :value="8">8</option>
              <option :value="10">10</option>
              <option :value="12">12</option>
              <option :value="20">20</option>
            </select>
          </span>
        </div>
        <span>{{ resultType }}:</span>
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, Ref } from 'vue'
import { Chart, ChartItem, TooltipItem, registerables } from 'chart.js'
import { useToast } from '@/composables/toast'

const { toast } = useToast()

let chart: Chart
const chartRef: Ref<ChartItem | null> = ref(null)
Chart.register(...registerables)

const makeNewChart = () => {
  if (chartRef.value) {
    chart = new Chart(chartRef.value, {
      type: 'bar',
      data: {
        labels: resultData.value.xAxis,
        datasets: [
          {
            label: '# of Votes',
            data: resultData.value.yAxis,
            borderWidth: 1,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(201, 203, 207, 1)',
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem: TooltipItem<'bar'>) => {
                const value = tooltipItem.formattedValue
                return `${value}%`
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Dice sum total',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Chance of result',
            },
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value}%`,
            },
          },
        },
      },
    })
  }
}

const refreshChart = () => {
  chart.data.labels = resultData.value.xAxis
  chart.data.datasets[0].data = resultData.value.yAxis
  chart.update()
}

onMounted(() => {
  makeNewChart()
})

const sides = ref(6)
const dice = ref(1)
const resultType = ref('')

const resetInputs = () => {
  sides.value = 6
  dice.value = 1
}

const numberArrayMap = new Map<number, number[]>()

const numberToArray = (number: number) => {
  if (numberArrayMap.has(number)) {
    return numberArrayMap.get(number) as number[]
  }
  const array = []
  for (let i = 1; i <= number; i++) {
    array.push(i)
  }
  numberArrayMap.set(number, array)
  return array
}

const dices = computed(() => numberToArray(dice.value).map(() => sides.value))

const getResultsOfDieAndChildren = (die: number[]): number[] => {
  const results: number[] = []
  try {
    numberToArray(die[0]).forEach((sideValue) => {
      results.push(
        ...(die[1]
          ? getResultsOfDieAndChildren(die.slice(1)).map(
              (total: number) => total + sideValue
            )
          : [sideValue])
      )
    })
  } catch (e) {
    console.log(e)
    toast("That's too many calculations for your poor browser!")
    resetInputs()
    return []
  }
  dieResults.value = results
  return results
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
}

const getRandomSample = (): void => {
  dieResults.value = []
  for (let i = 0; i < 200000; i++) {
    dieResults.value.push(
      dices.value.reduce(
        (total, maxValue) => total + getRandomInt(1, maxValue) + 1,
        0
      )
    )
  }
}

const getGraphData = () => {
  if (dices.value.reduce((a, b) => a * b, 1) > 1000000) {
    getRandomSample()
    resultType.value = 'Approximate distribution'
  } else {
    getResultsOfDieAndChildren(dices.value)
    resultType.value = 'Exact distribution'
  }
}

const dieResults: Ref<number[]> = ref([])

const resultData = computed(() => {
  const totals: Set<number> = new Set()
  const counts: Map<number, number> = new Map()

  dieResults.value.forEach((result) => {
    const total = counts.get(result)
    totals.add(result)
    counts.set(result, total ? total + 1 : 1)
  })

  const xAxis = Array.from(totals).sort((a, b) => a - b)
  let yAxis = xAxis.map((x) => counts.get(x)) as number[]
  const totalResults = yAxis.reduce((a, b) => a + b, 0)
  yAxis = yAxis.map((y) => (y / totalResults) * 100)

  return { xAxis, yAxis }
})

watch(
  dices,
  () => {
    getGraphData()
  },
  { immediate: true }
)
watch(resultData, () => refreshChart(), { deep: true })
</script>
