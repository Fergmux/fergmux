<template>
  <div class="bg-img bg-img-cover min-h-screen">
    <div class="flex flex-col items-center pt-20">
      <h1 class="mb-7 text-5xl font-semibold underline">
        Siege Rank Calculator
      </h1>
      <div class="mt-10 flex">
        <select v-model="selected" class="mr-5 rounded-md p-2 text-black">
          <option value="">Please select one</option>
          <option v-for="rank in ranks" :key="rank.id" :value="rank.id">
            {{ rank.name }}
          </option>
        </select>
        <div>
          <h3>You are better than</h3>
          <p>
            <b class="text-lg text-mint-800">
              {{ selectedRank ? selectedRank.cumulative : 0 }}%
            </b>
            of players
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ranks from '@/data/siegeRanks.js'
import { computed, ref } from 'vue'

export default {
  setup() {
    const selected = ref('')
    const selectedRank = computed(() =>
      ranks.find((rank) => rank.id === selected.value)
    )
    return { ranks, selected, selectedRank }
  },
}
</script>

<style lang="scss" scoped></style>
