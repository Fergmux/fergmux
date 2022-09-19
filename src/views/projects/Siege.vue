<template>
  <div class="min-h-screen bg-img bg-img-cover">
    <div class="flex flex-col items-center pt-20">
      <h1 class="text-5xl font-semibold underline mb-7">
        Siege Rank Calculator
      </h1>
      <div class="flex mt-10">
      <select v-model="selected" class="p-2 mr-5 text-black rounded-md">
        <option value="">Please select one</option>
        <option v-for="rank in ranks" :value="rank.id">{{rank.name}}</option>
      </select>
      <div>
        <h3>You are better than</h3>
        <p><b class="text-lg text-mint-800">{{selectedRank ? selectedRank.cumulative : 0}}%</b> of players</p>
      </div>
    </div>
      
    </div>
  </div>
</template>

<script>
import ranks from '@/data/siegeRanks.js'
import { computed, ref, } from 'vue'
import { useToast } from '@/composables/toast'

export default {
  setup() {
    const selected = ref("")
    const selectedRank = computed(() => ranks.find(rank => rank.id === selected.value))
    return {ranks, selected, selectedRank}
  },
}
</script>

<style lang="scss" scoped></style>
