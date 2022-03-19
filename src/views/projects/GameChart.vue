<template>
  <div class="bg-img bg-img-cover">
    <div class="flex flex-col items-center py-20 mx-auto">
      <h1 class="text-5xl font-semibold underline mb-7">
        Game studio market share
      </h1>

      <simple-typeahead
        id="search-bar"
        ref="searchBar"
        placeholder="Search for a studio or game"
        :items="itemKeyList"
        :min-input-length="1"
        @select-item="selectSearchItem($event)"
        @on-focus="fieldFocused = true"
        @on-blur="fieldFocused = false"
      />

      <div class="flex items-center justify-center mt-5">
        <span
          v-if="state.indexes.length"
          class="mr-2 text-base cursor-pointer material-icons-outlined"
          @click="drillup(1)"
        >
          backspace
        </span>

        <p class="text-sm pb-[0.2rem]">
          <template
            v-for="(path, index) in pagePath"
            :key="`path-level-${index}`"
          >
            <span
              class="cursor-pointer"
              @click="drillup(pagePath.length - index - 1)"
              >{{ path }}</span
            >
            <span v-if="pagePath.length > 1 && index < pagePath.length - 1">
              >
            </span>
          </template>
        </p>

        <span
          v-if="state.indexes.length > 1"
          class="ml-2 text-base cursor-pointer material-icons"
          @click="resetChart"
        >
          clear
        </span>
      </div>

      <p class="mt-1 text-lg font-semibold">{{ level }}</p>

      <div class="flex justify-center mt-5">
        <div
          class="relative max-w-screen-sm chart-container"
          style="width: 80vw"
        >
          <canvas ref="chartRef"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, Ref, onMounted, onBeforeUnmount } from 'vue'
import {
  Chart,
  ChartConfiguration,
  ChartItem,
  ChartEvent,
  registerables,
  TooltipCallbacks,
  TooltipItem,
  TooltipOptions,
} from 'chart.js'
import SimpleTypeahead from 'vue3-simple-typeahead'
import {
  chartConfig,
  gameData,
  GameData,
  getData,
  getLabels,
  levelMap,
  tooltipMap,
} from '@/data/gameData'

Chart.register(...registerables)

let searchInput: HTMLElement | null
const fieldFocused = ref(false)

const keydownListener = function (event: KeyboardEvent) {
  if (!fieldFocused.value) {
    if (event.key === 'Backspace') {
      drillup()
    }
    if (event.key === 'h') {
      resetChart()
    }
    if (event.key === 'l') {
      event.preventDefault()
      searchInput?.focus()
    }
  }
  if (event.key === 'Escape') {
    if (searchBar.value?.value) {
      searchBar.value.value = ''
    } else {
      searchInput?.blur()
    }
  }
}

onMounted(() => {
  Chart.defaults.color = 'rgb(248 250 252)'
  searchInput = document.getElementById('search-bar')
  document.addEventListener('keydown', keydownListener)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', keydownListener)
})

const chartRef: Ref<ChartItem | null> = ref(null)
const searchBar: Ref<HTMLInputElement | null> = ref(null)
let chart: Chart

onMounted(() => {
  const config: ChartConfiguration = {
    ...chartConfig,
    options: {
      onClick: drilldown,
    },
  }
  if (chartRef.value) {
    chart = new Chart(chartRef.value, config)
  }

  refreshChart()
})

const state: { indexes: number[] } = reactive({ indexes: [] })
let currentData: GameData[] | undefined

const refreshChart = () => {
  currentData = gameData

  state.indexes.forEach((index: number) => {
    const data: GameData | undefined = currentData?.[index]
    currentData = data?.children
  })

  const prefix = state.indexes.length === 3 ? ' ' : ' $'
  const suffix = tooltipMap[state.indexes.length]

  Chart.overrides.doughnut.plugins.tooltip = {
    callbacks: {
      label: (tooltipItem: TooltipItem<'doughnut'>) =>
        prefix + tooltipItem.parsed + suffix,
    } as TooltipCallbacks<'doughnut'>,
  } as TooltipOptions<'doughnut'>

  chart.data.labels = getLabels(currentData)
  chart.data.datasets[0].data = getData(currentData)
  chart.update()
}

let skippedGroup = false

const drilldown = (chartEvent: ChartEvent) => {
  const index = chart.getElementsAtEventForMode(
    chartEvent.native as Event,
    'nearest',
    { intersect: true },
    true
  )[0].index

  const children = currentData?.[index].children

  if (children?.length) {
    state.indexes.push(index)

    if (isOneChildParent(children)) {
      skippedGroup = true
      state.indexes.push(0)
    }

    refreshChart()
  }
}

const isOneChildParent = (children: GameData[]) =>
  children.length === 1 && children[0].children.length

const drillup = (levels = 1) => {
  for (let i = 0; i < levels; i++) {
    state.indexes.pop()

    if (skippedGroup && state.indexes.length === 1) {
      state.indexes.pop()
      skippedGroup = false
    }
  }

  refreshChart()
}

const level = computed(() => levelMap[state.indexes.length])

const itemKeyList = computed(() =>
  getItemKeys(gameData)
    .flat()
    .filter((a) => a)
)

const getItemKeys = (data: GameData[]): (string | GameData | null)[][] =>
  data.map((game) => [game.key, ...getItemKeys(game.children).flat()])

const pagePath = computed(() =>
  state.indexes.length
    ? getPagePath(0, gameData[state.indexes[0]]).filter((a) => a)
    : ['Click a segment to get more detail']
)

const getPagePath = (level: number, data: GameData): (string | null)[] => [
  data.key,
  ...(level !== state.indexes.length - 1
    ? getPagePath(level + 1, data.children[state.indexes[level + 1]])
    : []),
]

const resetChart = () => {
  state.indexes = []
  refreshChart()
}

const selectSearchItem = (item: string) => {
  const indexes = []

  const getIndexOfSearch = (search: string, data: GameData[]) =>
    data.findIndex((game: GameData) => {
      if (game.key === search) {
        return true
      } else {
        const i = getIndexOfSearch(search, game.children)
        if (i >= 0) {
          if (isOneChildParent(game.children)) {
            skippedGroup = true
          }
          indexes.push(i)
          return true
        }
      }
    })

  indexes.push(getIndexOfSearch(item, gameData))
  indexes.splice(0, 1)
  indexes.reverse()
  state.indexes = indexes

  refreshChart()
}
</script>

<style lang="scss" scoped>
.simple-typeahead {
  position: relative;
  width: 80vw;
  max-width: 500px;
  color: #2c3e50;

  &-input {
    width: 100%;
    border: 1px rgb(0, 0, 0, 0.3) solid;
    padding: 4px;
    padding-left: 6px;
    border-radius: 4px;
    margin-top: 12px;
  }

  &-list {
    position: absolute;
    width: 100%;
    padding: 5px;
    z-index: 3;
    background-color: white;
    border: 1px rgb(0, 0, 0, 0.3) solid;
    border-radius: 4px;
    max-height: 50vh;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      display: none;
    }

    &-item-active {
      background-color: rgb(0, 0, 0, 0.05);
    }
  }
}

.bg-img {
  background-image: url('@/assets/images/backgrounds/shiny.svg');
}
</style>
