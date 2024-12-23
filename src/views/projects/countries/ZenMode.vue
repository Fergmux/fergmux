<template>
  <div>
    <div>
      <p class="text-center text-2xl font-semibold">Search for a country</p>
      <Search :list="countries" class="mt-7" @select="moveToCountry" />
      <div id="map" class="mt-14 w-[960px]"></div>
      <div class="mt-14 flex items-center justify-evenly">
        <div class="flex w-96 flex-col items-center gap-2">
          <template v-if="countryCodeMap?.[selectedCode]">
            <p>Country:</p>
            <b class="text-2xl">{{ countryCodeMap?.[selectedCode] }}</b>
          </template>

          <template v-if="cities[selectedCode]">
            <p class="mt-4">Capital city:</p>
            <b class="text-2xl">{{ cities[selectedCode] }}</b>
          </template>
        </div>
        <img :src="flag" alt="" class="mt-4 h-52" />
      </div>
    </div>
    <div
      id="tooltip"
      class="pointer-events-none invisible absolute rounded bg-black/70 p-2 text-white"
    ></div>
  </div>
</template>

<script setup lang="ts">
import Search from '@/components/Search.vue'
import cities from '@/data/capitalCities'
import * as d3 from 'd3'
import type { Ref } from 'vue'
import { computed, onMounted, ref } from 'vue'

/* eslint-disable @typescript-eslint/no-explicit-any */

const selectedCode = ref('')
const flag = computed(() => {
  return `https://flagcdn.com/${selectedCode.value}.svg`
})

const countryCodeMap: Ref<Record<string, string> | undefined> = ref()

const countries = computed(
  () => countryCodeMap.value && Object.values(countryCodeMap.value)
)

const countryNameMap = computed(() => {
  return (
    countryCodeMap.value &&
    Object.fromEntries(
      Object.entries(countryCodeMap.value).map(([key, value]) => [value, key])
    )
  )
})

const zoomLevel = ref(1)
const width = 960
const height = 500
let geoData: GeoJSON.FeatureCollection
let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
let path: d3.GeoPath<any, d3.GeoPermissibleObjects>
let g: d3.Selection<SVGGElement, unknown, HTMLElement, any>
let zoom: d3.ZoomBehavior<Element, unknown>

onMounted(() => {
  fetch('https://flagcdn.com/en/codes.json')
    .then((response) => response.json())
    .then((data) => {
      countryCodeMap.value = data
    })
  // Define dimensions and create the SVG element

  svg = d3
    .select('#map')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', '#1C2541')

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
    .scaleExtent([2, 1000]) // Minimum and maximum zoom levels
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
      if (countryCodeMap.value) {
        const unusedCodes = Object.entries(countryCodeMap.value).filter(
          ([code]) =>
            geoData.features.some(
              (d) => d.properties?.ISO_A2.toLowerCase() === code
            )
        )
        countryCodeMap.value = Object.fromEntries(unusedCodes)
      }
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
        .attr('fill', '#5BC0BE')
        .on('mouseover', function (event, d) {
          d3.select(this).attr('fill', '#6FFFE9')
          const tooltip = d3.select('#tooltip')
          tooltip.style('visibility', 'visible').text(d.properties?.ADMIN)
        })
        .on('mouseout', function (event, d) {
          if (selectedCode.value === d.properties?.ISO_A2.toLowerCase()) {
            d3.select(this).attr('fill', '#ffffff')
          } else {
            d3.select(this).attr('fill', '#5BC0BE')
          }
          d3.select('#tooltip').style('visibility', 'hidden')
        })
        .on('mousemove', function (event) {
          const tooltip = d3.select('#tooltip')
          tooltip
            .style('left', event.pageX + 10 + 'px') // Offset the tooltip a bit from the cursor
            .style('top', event.pageY + 10 + 'px')
        })
        .on('click', function (event, d) {
          let code = d.properties?.ISO_A2.toLowerCase()
          if (code === '-') {
            code = countryNameMap.value?.[d.properties?.ADMIN]
          }
          if (code === selectedCode.value) {
            selectedCode.value = ''
          } else {
            selectedCode.value = code
          }
          g.selectAll('path')
            .attr('fill', '#5BC0BE') // Reset all countries
            .filter(
              (d) =>
                (d as GeoJSON.Feature).properties?.ISO_A2.toLowerCase() ===
                selectedCode.value?.toLowerCase()
            )
            .attr('fill', '#ffffff') // Highlight the selected country
        })
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5 / zoomLevel.value)
    })
    .catch((error) => {
      console.error('Error loading GeoJSON data:', error)
    })
})

const moveToCountry = (countryName: string) => {
  const countryCode = countryNameMap.value?.[countryName]
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
    const scale = Math.min(1000, 0.9 / Math.max(dx / width, dy / height))
    const translate = [width / 2 - scale * x, height / 2 - scale * y]

    const transform = d3.zoomIdentity
      .translate(translate[0], translate[1])
      .scale(scale)

    g.selectAll('path')
      .attr('fill', '#5BC0BE') // Reset all countries
      .filter(
        (d) =>
          (d as GeoJSON.Feature).properties?.ISO_A2.toLowerCase() ===
          countryCode?.toLowerCase()
      )
      .attr('fill', '#ffffff') // Highlight the selected country

    g.transition()
      .duration(750)
      .attr('transform', transform as any)
    svg
      .transition()
      .duration(750)
      .call(zoom.transform as any, transform)
  }
}
</script>

<style scoped></style>
