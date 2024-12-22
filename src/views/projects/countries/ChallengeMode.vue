<template>
  <div>
    <div v-if="stage === Stage.Prepare" class="flex flex-col items-center">
      <div class="mt-14 flex w-80 items-center justify-between">
        <p>How many rounds?</p>
        <div class="relative">
          <select v-model="numberOfQuestions" class="select text-black">
            <option value="2">2</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="max">All</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
          >
            <svg
              class="h-4 w-4 fill-current text-mint-800"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>
        </div>
      </div>
      <!-- easy/hard toggle -->
      <div class="mt-7 flex w-80 items-center justify-between">
        <p>Hard mode?</p>
        <input v-model="hardMode" class="checkbox" type="checkbox" />
      </div>
      <div class="mt-14">
        <button class="button-light" @click="startChallenge">Start</button>
      </div>
    </div>

    <div v-if="stage === Stage.Flag" class="mt-14 flex flex-col items-center">
      <p class="text-2xl">What flag is this?</p>
      <img :src="flag" alt="" class="mt-14 h-52" />
      <Search
        ref="countryInput"
        :list="countries"
        class="mt-14"
        @keyup.enter="nextStage"
        @select="countrySelected"
      />
      <div v-if="selectedCountry" class="mt-7 text-xl">
        <p>
          <span
            :class="{
              'text-green-500': selectedCountryCorrect,
              'text-red-500': !selectedCountryCorrect,
            }"
          >
            {{ selectedCountryCorrect ? 'Correct. It is ' : 'Nope. It is ' }}
          </span>
          <b>{{ correctCountry }}</b>
        </p>

        <button
          ref="nextButton"
          class="button-light m-auto mt-7 block"
          @click="nextStage"
        >
          Next
        </button>
      </div>
    </div>

    <template v-if="stage === Stage.Map">
      <div class="mt-14 flex flex-col items-center">
        <p class="text-2xl">Where is {{ correctCountry }} on the map?</p>
        <div id="map" class="mt-7 w-[960px]"></div>
        <template v-if="selectedMapCountry">
          <div
            class="mt-7 text-2xl"
            :class="{
              'text-green-500': selectedMapCountryCorrect,
              'text-red-500': !selectedMapCountryCorrect,
            }"
          >
            {{
              selectedMapCountryCorrect
                ? "Correct! That's the one!"
                : 'Nope! it was here'
            }}
          </div>
          <button ref="nextButton" class="button-light mt-7" @click="nextStage">
            Next
          </button>
        </template>
      </div>
    </template>

    <template v-if="stage === Stage.Capital">
      <p class="mt-14 text-2xl">
        What is the capital city of {{ correctCountry }}?
      </p>
      <Search
        ref="cityInput"
        :list="cities"
        class="mt-14"
        @select="capitalSelected"
      />
      <div v-if="selectedCapital" class="mt-7 flex flex-col items-center">
        <p class="text-xl">
          <span
            :class="{
              'text-green-500': selectedCapitalCorrect,
              'text-red-500': !selectedCapitalCorrect,
            }"
          >
            {{ selectedCapitalCorrect ? 'Correct! It is ' : 'Nope! it is ' }}
          </span>
          <b>{{ citiesMap[selectedCode] }}</b>
        </p>
        <button
          ref="nextButton"
          class="button-light mt-7 block"
          @click="nextQuestion"
        >
          Next
        </button>
      </div>
    </template>

    <template v-if="stage === Stage.Results">
      <div class="mt-14 text-center">
        <p
          class="text-2xl font-semibold text-green-500"
          :class="{
            'text-green-500': percentage >= 0.3,
            'text-red-500': percentage < 0.3,
          }"
        >
          {{ result }}
        </p>
        <p class="my-7 text-xl">
          You got: {{ scores.flags + scores.locations + scores.capitals }}/{{
            questions.flags + questions.locations + questions.capitals
          }}
          correct!
        </p>
        <p>You got {{ scores.flags }}/{{ questions.flags }} flags correct</p>
        <p>
          You got {{ scores.locations }}/{{ questions.locations }} locations
          correct
        </p>
        <p>
          You got {{ scores.capitals }}/{{ questions.capitals }} capitals
          correct
        </p>
      </div>
    </template>

    <template v-if="stage !== Stage.Results && stage !== Stage.Prepare">
      <p class="mt-14 text-center">
        You have answered
        {{ scores.flags + scores.locations + scores.capitals }}/{{
          questions.flags + questions.locations + questions.capitals
        }}
        questions correctly.
      </p>
      <div class="mt-7 flex justify-center gap-7">
        <button
          class="button-dark m-auto mt-7 border-2 border-mint-700"
          @click="reset"
        >
          Reset
        </button>
        <button class="button-light m-auto mt-7" @click="skip">Skip</button>
      </div>
    </template>

    <template v-if="stage === Stage.Results">
      <button
        class="button-dark m-auto mt-7 block border-2 border-mint-700"
        @click="reset"
      >
        Reset
      </button>
    </template>
    <!--       
      <div class="mt-14 flex items-center justify-evenly">
        <div class="flex w-96 flex-col items-center gap-2">
          <template v-if="correctCountry">
            <p>Country:</p>
            <b class="text-2xl">{{ correctCountry }}</b>
          </template>

          <template v-if="cities[selectedCode]">
            <p class="mt-4">Capital city:</p>
            <b class="text-2xl">{{ cities[selectedCode] }}</b>
          </template>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import Search from '@/components/Search.vue'
import { useToast } from '@/composables/toast'
import citiesMap from '@/data/capitalCities'
import easyCountries from '@/data/easyCountries'
import * as d3 from 'd3'
import type { Ref } from 'vue'
import { computed, nextTick, onMounted, ref } from 'vue'

const { toast } = useToast()

enum Stage {
  Prepare,
  Flag,
  Map,
  Capital,
  Results,
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const countryInput = ref<HTMLInputElement | null>(null)
const nextButton = ref<HTMLButtonElement | null>(null)
const cityInput = ref<HTMLInputElement | null>(null)

const selectedCode = ref('')
const flag = computed(() => {
  return `https://flagcdn.com/${selectedCode.value}.svg`
})

const countryCodeMapBase: Ref<Record<string, string> | undefined> = ref()
const countryCodeMap = computed(() => {
  if (hardMode.value) {
    return countryCodeMapBase.value
  }
  return easyCountries
})

const countries = computed(
  () =>
    countryCodeMap.value &&
    Object.values(countryCodeMap.value).filter((code) => !code.includes('-'))
)

const cities = computed(() => {
  return Object.values(citiesMap)
})

const countryNameMap = computed(() => {
  return (
    countryCodeMap.value &&
    Object.fromEntries(
      Object.entries(countryCodeMap.value).map(([key, value]) => [value, key])
    )
  )
})

const numberOfQuestions = ref(10)
const hardMode = ref(false)

const stage = ref(Stage.Prepare)
const selectedCountry = ref('')
const selectedCountryCorrect = computed(() => {
  return selectedCode.value === selectedCountry.value
})

const selectedMapCountry = ref('')
const selectedMapCountryCorrect = computed(() => {
  return selectedCode.value === selectedMapCountry.value
})

const selectedCapital = ref('')
const selectedCapitalCorrect = computed(() => {
  return citiesMap[selectedCode.value] === selectedCapital.value
})

const correctCountry = computed(() => {
  return countryCodeMap.value?.[selectedCode.value]
})

const scores = ref({
  flags: 0,
  locations: 0,
  capitals: 0,
})
const questions = ref({
  flags: 0,
  locations: 0,
  capitals: 0,
})
const questionCounter = ref(0)
const previousAnswers: Ref<string[]> = ref([])
const percentage = computed(() => {
  return (
    (scores.value.flags + scores.value.locations + scores.value.capitals) /
    (questions.value.flags +
      questions.value.locations +
      questions.value.capitals)
  )
})
const result = computed(() => {
  const percent = percentage.value
  if (percent === 0.05) {
    return 'Maybe give easy mode a try. 😅'
  } else if (percent < 0.2) {
    return 'You can do better! 👍'
  } else if (percent < 0.4) {
    return 'Not bad! 😁'
  } else if (percent < 0.6) {
    return 'Pretty good! 💪'
  } else if (percent < 0.8) {
    return 'Excellent job! 🤓'
  } else if (percent < 0.9) {
    return 'Incredible! 😱'
  } else if (percent === 1) {
    return 'Amazing! Perfect score! 🤯'
  } else {
    return 'Great job! 👍'
  }
})

const zoomLevel = ref(1)
const width = 960
const height = 500

let geoData: GeoJSON.FeatureCollection
let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
let path: d3.GeoPath<any, d3.GeoPermissibleObjects>
let g: d3.Selection<SVGGElement, unknown, HTMLElement, any>
let zoom: d3.ZoomBehavior<Element, unknown>

const initMap = () => {
  svg = d3
    .select('#map')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', '#f0f8ff')

  // Define a projection and a path generator
  const projection = d3
    .geoNaturalEarth1()
    .scale(150)
    .translate([width / 2, height / 2])

  path = d3.geoPath().projection(projection)

  // Create a group for the map
  g = svg.append('g')

  // Define zoom behavior
  zoom = d3
    .zoom()
    .scaleExtent([4, 1000]) // Minimum and maximum zoom levels
    .translateExtent([
      [0, 0],
      [width, height],
    ]) // Define pan boundaries
    .on('zoom', (event) => {
      g.attr('transform', event.transform)
      zoomLevel.value = event.transform.k
      g.selectAll('path').attr('stroke-width', 0.5 / zoomLevel.value) // Reduce stroke width as zoom increases
    })

  // Add zoom behavior to the SVG element
  svg.call(zoom as any)

  // Set default zoom level
  const initialScale = 4 // Default zoom scale
  const initialX = -width * 1.5 // Adjust to position the map horizontally
  const initialY = -height / 2 // Adjust to position the map vertically

  const defaultTransform = d3.zoomIdentity
    .translate(initialX, initialY) // Apply the translation
    .scale(initialScale) // Apply the zoom scale

  // Apply the transform to the group
  g.attr('transform', defaultTransform as any)

  // Programmatically set the zoom transform
  svg.call(zoom.transform as any, defaultTransform)

  // Load and render the GeoJSON data
  d3.json(
    'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
  )
    .then((data) => {
      geoData = data as GeoJSON.FeatureCollection
      g.selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('d', (d) => {
          if (d.geometry && d.geometry.type === 'Polygon') {
            return path({
              type: 'Polygon',
              coordinates: d.geometry.coordinates,
            })
          } else if (d.geometry && d.geometry.type === 'MultiPolygon') {
            return path({
              type: 'MultiPolygon',
              coordinates: d.geometry.coordinates,
            })
          }
          return null // Ignore non-polygon geometries
        })
        .attr('fill', '#d9d9d9')
        .on('mouseover', function () {
          d3.select(this).attr('fill', '#a6cee3')
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', '#d9d9d9')
        })
        .on('click', async function (event, d) {
          if (selectedMapCountry.value) return
          let code = d.properties?.ISO_A2.toLowerCase()
          if (code === '-') {
            code = countryNameMap.value?.[d.properties?.ADMIN]
          }
          selectedMapCountry.value = code
          g.selectAll('path')
            .attr('fill', '#d9d9d9') // Reset all countries
            .filter(
              (d) =>
                (d as GeoJSON.Feature).properties?.ISO_A2.toLowerCase() ===
                selectedCode.value?.toLowerCase()
            )
            .attr('fill', '#ffcc00') // Highlight the selected country
          if (selectedCode.value !== selectedMapCountry.value) {
            moveToCountry(selectedCode.value)
          } else {
            scores.value.locations++
          }
          questions.value.locations++
          await nextTick()
          nextButton.value?.focus()
        })
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5 / zoomLevel.value)
    })
    .catch((error) => {
      console.error('Error loading GeoJSON data:', error)
    })
}

onMounted(() => {
  fetch('https://flagcdn.com/en/codes.json')
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      countryCodeMapBase.value = Object.fromEntries(
        Object.entries(data as Record<string, string>).filter(
          ([key]) => !key.includes('-')
        )
      )
    })
  // Define dimensions and create the SVG element

  initMap()
})

const moveToCountry = (countryName: string) => {
  const countryCode = countryNameMap.value?.[countryName] ?? countryName
  selectedCode.value = countryCode?.toLowerCase() ?? ''
  const country = geoData.features.find(
    (d) => d.properties?.ISO_A2.toLowerCase() === countryCode?.toLowerCase()
  )
  if (country) {
    const [[x0, y0], [x1, y1]] = path.bounds(country)
    const dx = x1 - x0
    const dy = y1 - y0
    const x = (x0 + x1) / 2
    const y = (y0 + y1) / 2
    const scale = Math.min(8, 0.9 / Math.max(dx / width, dy / height))
    const translate = [width / 2 - scale * x, height / 2 - scale * y]

    const transform = d3.zoomIdentity
      .translate(translate[0], translate[1])
      .scale(scale)

    g.selectAll('path')
      .attr('fill', '#d9d9d9') // Reset all countries
      .filter(
        (d) =>
          (d as GeoJSON.Feature).properties?.ISO_A2.toLowerCase() ===
          countryCode?.toLowerCase()
      )
      .attr('fill', '#ffcc00') // Highlight the selected country

    g.transition()
      .duration(750)
      .attr('transform', transform as any)
    svg
      .transition()
      .duration(750)
      .call(zoom.transform as any, transform)
  }
}

const startChallenge = async () => {
  const randomCountry =
    countries.value?.[Math.floor(Math.random() * countries.value.length)]
  if (
    countryNameMap.value &&
    previousAnswers.value.includes(countryNameMap.value[randomCountry || ''])
  ) {
    startChallenge()
  } else {
    selectedCode.value =
      (randomCountry && countryNameMap.value?.[randomCountry]) || ''
    stage.value = Stage.Flag
    await nextTick()
    countryInput.value?.focus()
  }
}

const countrySelected = async (country: string) => {
  if (selectedCountry.value) return
  selectedCountry.value = countryNameMap.value?.[country] || ''
  if (selectedCode.value === selectedCountry.value) {
    scores.value.flags++
  }
  questions.value.flags++
  await nextTick()
  nextButton.value?.focus()
}

const capitalSelected = async (capital: string) => {
  if (selectedCapital.value) return
  selectedCapital.value = capital
  if (selectedCapitalCorrect.value) {
    scores.value.capitals++
  }
  questions.value.capitals++
  await nextTick()
  nextButton.value?.focus()
}

const nextStage = async () => {
  switch (stage.value) {
    case Stage.Flag:
      stage.value = Stage.Map
      await nextTick()
      initMap()
      break
    case Stage.Map:
      stage.value = Stage.Capital
      await nextTick()
      cityInput.value?.focus()
      break
  }
}

const nextQuestion = () => {
  selectedCapital.value = ''
  selectedMapCountry.value = ''
  selectedCountry.value = ''
  questionCounter.value++
  if (questionCounter.value >= numberOfQuestions.value) {
    stage.value = Stage.Results
  } else {
    previousAnswers.value.push(selectedCode.value)
    startChallenge()
  }
}

const skip = () => {
  if (stage.value === Stage.Flag) {
    if (!selectedCountry.value) {
      toast(`It was ${correctCountry.value}`)
      questions.value.flags++
    }
    nextStage()
  } else if (stage.value === Stage.Map) {
    if (!selectedMapCountry.value) {
      questions.value.locations++
    }
    nextStage()
  } else if (stage.value === Stage.Capital) {
    if (!selectedCapital.value) {
      toast(`It was ${citiesMap[selectedCode.value]}`)
      questions.value.capitals++
    }
    nextQuestion()
  }
}

const reset = () => {
  stage.value = Stage.Prepare
  scores.value = {
    flags: 0,
    locations: 0,
    capitals: 0,
  }
  questionCounter.value = 0
  previousAnswers.value = []
  questions.value = {
    flags: 0,
    locations: 0,
    capitals: 0,
  }
  selectedCode.value = ''
  selectedCountry.value = ''
  selectedCapital.value = ''
  selectedMapCountry.value = ''
}
</script>

<style scoped></style>
