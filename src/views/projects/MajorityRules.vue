<template>
  <div class="w-full p-10 pt-16 md:p-20 bg-img bg-img-cover">
    <div class="max-w-screen-lg m-auto">
      <h1 class="mb-16 header-main">Majority Rules</h1>
      <button class="block mt-5 button-light" @click="createGame">
        Create game
      </button>
      <input
        v-model="playerName"
        type="text"
        class="text-field"
        placeholder="Name"
      />
      <input
        v-model="maxScore"
        type="number"
        class="text-field"
        placeholder="Max score"
      />
      <p>{{ gameId }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { _62To10, _10To62 } from 'simple-base-converter'
import { useUser } from '@/stores/user'
import api from '@/lib/api'

const userStore = useUser()

userStore.getUserId()

const maxScore = ref(8)
const playerName: Ref<string> = ref(null)
const gameId: Ref<string> = ref(null)

const response = await api.post('/.netlify/functions/fetch-user', {
  userId: userStore.userId,
  userSecret: userStore.userSecret,
})

console.log(response)

const createGame = async (): Promise<void> => {
  const response = await api.post('/.netlify/functions/create-mr-game', {
    userId: userStore.userId,
    userName: userStore.userName,
  })

  gameId.value = _10To62(response.gameId).toString()
}

// Online stream
// Setup menu
// In game interface
// Win condition/tie breaker
// Pink cow
// Help modal
// Points
// Questions
// Multiple choice/User input
// Fuzzy answer matching
// Link answers function
// Animate cards
// Card art
// User uploaded questions
// Questions you don't like
// Save answer mappings
// Representaion of the game
// Look at past cards
// Players leaving/joining/kicking
// Matchmaking
// Track stats
// Friends/invites
// Leaderboard
// Delete account
</script>

<style lang="scss" scoped>
.bg-img {
  background-image: url('@/assets/images/backgrounds/hexagon.svg');
}
</style>
