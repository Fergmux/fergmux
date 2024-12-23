<template>
  <div class="relative mx-auto w-full max-w-md">
    <input
      ref="input"
      v-model="query"
      type="text"
      class="text-input !w-full"
      placeholder="Search..."
      @input="onInput"
      @keydown.down="moveDown"
      @keydown.up="moveUp"
      @keyup.enter.stop="acceptTopResult"
    />
    <ul
      v-if="filteredList.length"
      ref="listContainer"
      class="scrollbar-none absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-mint-700 bg-mint-300 shadow-lg"
    >
      <li
        v-for="(item, index) in filteredList"
        :key="index"
        :ref="(el) => { if(index === selectedIndex) selectedItem = el as HTMLElement }"
        :class="{
          'bg-mint-500': index === selectedIndex,
          'cursor-pointer px-4 py-2': true,
        }"
        @click="selectItem(item)"
        @mouseover="selectedIndex = index"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Fuse from 'fuse.js'
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'

// Define the props for the component
const props = defineProps({
  list: {
    type: Array<string>,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits({ select: (item: string) => item })

const input: Ref<HTMLInputElement | null> = ref(null)
const listContainer: Ref<HTMLUListElement | null> = ref(null)
const selectedItem: Ref<HTMLElement | null> = ref(null)

// Reactive query, filtered list, and selected index for arrow key navigation
const query = ref('')
const filteredList: Ref<string[]> = ref([])
const selectedIndex = ref(0) // Tracks the selected index for navigation

// Watch for changes to selectedItem and ensure it's visible
watch(selectedItem, (el) => {
  if (el && listContainer.value) {
    const container = listContainer.value
    const itemTop = el.offsetTop
    const itemBottom = itemTop + el.offsetHeight
    const containerTop = container.scrollTop
    const containerBottom = containerTop + container.offsetHeight

    if (itemTop < containerTop) {
      // Scroll up if item is above visible area
      container.scrollTop = itemTop
    } else if (itemBottom > containerBottom) {
      // Scroll down if item is below visible area
      container.scrollTop = itemBottom - container.offsetHeight
    }
  }
})

// Computed property for Fuse instance that updates whenever the list changes
const fuse = computed(() => {
  return new Fuse<string>(props.list, {
    includeScore: true,
    threshold: 0.5, // Adjust this for more or less sensitivity
  })
})

// Handle input changes to filter the list
const onInput = () => {
  if (query.value.trim() === '') {
    filteredList.value = []
    selectedIndex.value = 0 // Reset selected index when query is empty
  } else {
    filteredList.value = fuse.value
      .search(query.value)
      .map((result) => result.item)
    selectedIndex.value = 0 // Reset selected index on new search
  }
}

// Move the selected index down in the list
const moveDown = (e: KeyboardEvent) => {
  if (filteredList.value.length === 0) return

  selectedIndex.value = (selectedIndex.value + 1) % filteredList.value.length // Loop back to the top if at the bottom
  e.preventDefault() // Prevent the default behavior of the arrow key
}

// Move the selected index up in the list
const moveUp = (e: KeyboardEvent) => {
  if (filteredList.value.length === 0) return

  selectedIndex.value =
    (selectedIndex.value - 1 + filteredList.value.length) %
    filteredList.value.length // Loop to the bottom if at the top
  e.preventDefault() // Prevent the default behavior of the arrow key
}

// Accept the top result when Enter is pressed
const acceptTopResult = () => {
  if (filteredList.value.length > 0 && selectedIndex.value >= 0) {
    selectItem(filteredList.value[selectedIndex.value])
  }
}

// Select an item from the filtered list
const selectItem = (item: string) => {
  query.value = item
  filteredList.value = []
  selectedIndex.value = -1
  emit('select', item)
}

defineExpose({
  focus: () => {
    input.value?.focus()
  },
})
</script>

<style scoped>
/* Optional additional styling */
</style>
