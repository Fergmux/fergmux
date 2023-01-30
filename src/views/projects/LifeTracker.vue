<template>
  <Login v-if="userState.showLogin" class="p-10" />
  <div
    v-else
    class="min-h-screen w-full p-10 pt-16 md:p-20"
    :style="bgColorStyle"
  >
    <div class="flex flex-col items-center pt-10">
      <h1 class="signika mb-7 text-5xl font-bold underline drop-shadow-xl">
        Life Tracker
      </h1>
      <!-- <div class="my-5 text-2xl capitalize">{{ currentTimeframe }} Score</div> -->
      <div class="mt-10 rounded-2xl bg-slate-100 p-5 drop-shadow-2xl">
        <div
          class="mb-5 flex w-80 rounded-full border border-solid border-slate-300 drop-shadow-md"
          :style="darkColorStyle"
        >
          <!-- Timeframe toggle -->
          <div
            v-for="timeframe in timeframes"
            :key="timeframe"
            class="w-1/2 cursor-pointer rounded-full p-2 text-center font-semibold capitalize"
            :class="{
              'bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700':
                currentTimeframe === timeframe,
            }"
            @click="toggleTimeframe"
          >
            {{ timeframe }}
          </div>
        </div>
        <!-- Date -->
        <div
          class="flex w-full items-center justify-between text-center text-xl text-slate-700"
        >
          <span
            v-if="dateIndex > 0"
            class="material-icons mr-2 w-8 cursor-pointer"
            @click="changeDate(-1)"
          >
            arrow_back
          </span>
          <span v-else class="mr-2 w-8" />
          <span class="signika relative text-2xl font-semibold text-slate-600">
            <Datepicker
              :model-value="selectedDateCal"
              auto-apply
              :enable-time-picker="false"
              :allowed-dates="allowedDates"
              @update:model-value="dateChanged"
            >
              <template #trigger>
                {{ selectedDateFormatted }}
              </template>
            </Datepicker>
            <!-- class="absolute top-0 opacity-0" -->
          </span>
          <span
            v-if="dateIndex < datesLength - 1"
            class="material-icons ml-2 w-8 cursor-pointer"
            @click="changeDate(1)"
          >
            arrow_forward
          </span>
          <span v-else class="ml-2 w-8" />
        </div>
        <!-- Score -->
        <div
          class="signika relative mb-6 mt-4 flex justify-center text-[56pt] font-semibold"
        >
          <div
            v-if="canEditTasks"
            class="material-icons absolute -bottom-4 right-2 cursor-pointer text-slate-400"
            :class="editMode ? 'text-2xl' : 'text-xl'"
            @click="toggleEdit"
          >
            {{ editMode ? 'check' : 'edit' }}
          </div>
          <div
            class="flex h-28 w-28 items-center justify-center rounded-xl drop-shadow-xl"
            :style="bgColorStyle"
          >
            {{ totalScore }}
          </div>
        </div>
        <!-- Task list-->
        <draggable
          v-if="userState.userData && selectedDate"
          v-model="userState.userData[currentTimeframe].tasks[selectedDate]"
          :disabled="!canCompleteTasks"
          item-key="id"
          @end="saveTasks"
        >
          <template #item="{ element: task }">
            <div
              :key="task.id"
              class="mb-2 flex w-full items-center justify-between rounded-full border border-solid border-slate-300 bg-gradient-to-b p-2 drop-shadow-md transition-colors"
              :class="{
                'from-slate-100 to-slate-200 text-slate-700': task.done,
                'cursor-pointer': canCompleteTasks,
              }"
              :style="!task.done ? darkColorStyle : ''"
              @click="toggleDone(task.id)"
            >
              <!-- task name -->
              <div class="flex">
                <div
                  class="w-6 text-center"
                  :class="{
                    'text-slate-500': task.done,
                    'text-slate-300': !task.done,
                  }"
                >
                  <select
                    v-if="editMode"
                    v-model.number="task.score"
                    class="w-full cursor-pointer appearance-none rounded bg-transparent text-center"
                  >
                    <option :value="1">1</option>
                    <option :value="2">2</option>
                    <option :value="3">3</option>
                    <option :value="4">4</option>
                    <option :value="5">5</option>
                  </select>
                  <span v-else>{{ task.score }}</span>
                </div>
                <input
                  v-if="editMode"
                  v-model="task.description"
                  class="bg-transparent"
                />
                <span v-else>
                  {{ task.description }}
                </span>
              </div>
              <div
                v-if="editMode"
                class="material-icons cursor-pointer"
                @click="removeTask(task.id)"
              >
                delete
              </div>
              <div
                v-else
                class="h-5 w-5 rounded-full bg-gradient-to-br transition-colors"
                :class="{
                  ' from-red-400 to-red-600': !task.done,
                  ' from-green-400 to-green-600': task.done,
                }"
              />
            </div>
          </template>
        </draggable>
        <div
          v-if="canEditTasks"
          class="mt-2 flex w-full items-center justify-between rounded-full border border-solid border-slate-300 bg-gradient-to-b from-slate-100 to-slate-200 py-px px-2 text-slate-700 drop-shadow-md transition-all"
        >
          <div>
            <select
              v-model.number="newScore"
              class="w-6 cursor-pointer appearance-none rounded bg-transparent text-center text-slate-500"
            >
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="3">3</option>
              <option :value="4">4</option>
              <option :value="5">5</option>
            </select>
            <input
              v-model="newTask"
              type="text"
              placeholder="Add new goal"
              class="bg-transparent outline-none"
              @keyup.enter="addTask"
            />
          </div>
          <div class="material-icons cursor-pointer text-3xl" @click="addTask">
            add
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'
import { ref, Ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import isYesterday from 'date-fns/isYesterday'
import isTomorrow from 'date-fns/isTomorrow'
import isSameWeek from 'date-fns/isSameWeek'
import isThisWeek from 'date-fns/isThisWeek'
import isToday from 'date-fns/isToday'
import Datepicker from '@vuepic/vue-datepicker'
import confetti from 'canvas-confetti'
import { userState, saveTasks } from '@/store/lifeTrackerStore'
import Login from '@/components/Login.vue'
import type { Task, Timeframe } from '@/types/UserData'
import { gradients } from '@/data/gradients'
import { shade } from '@/lib/utils'

// const tasks: Ref<UserData> = ref({
//   username: 'fuck',
//   password: 'fuck',
//   daily: {
//     dates: [0],
//     tasks: {
//       0: [
//         { description: 'Go to the gym', done: true, score: 3 },
//         { description: 'Meditate', done: true, score: 2 },
//         { description: 'Do the dishes', done: false, score: 1 },
//       ],
//     },
//   },
//   weekly: {
//     dates: [0],
//     tasks: {
//       0: [
//         { description: "Don't vape", done: true, score: 4 },
//         { description: 'Go to rugby', done: false, score: 3 },
//       ],
//     },
//   },
// })

// Timeframes
const timeframes: Timeframe[] = ['daily', 'weekly']
const currentTimeframe = ref<Timeframe>('daily')
const isDaily = computed(() => currentTimeframe.value === 'daily')
const toggleTimeframe = () => {
  if (isDaily.value) {
    currentTimeframe.value = 'weekly'
  } else {
    currentTimeframe.value = 'daily'
  }
}

// Current date
const datesLength = computed(
  () => userState.userData?.[currentTimeframe.value].dates.length || 0
)
const dateIndex: Ref<number> = ref(datesLength.value - 1 || 0)
const allowedDates = computed(() => {
  const dates = userState.userData?.[currentTimeframe.value].dates
  return dates ? dates.map((date) => new Date(date)) : []
})

watch(
  () => datesLength.value,
  (newVal) => {
    dateIndex.value = newVal - 1
  }
)

const changeDate = (direction: number) => {
  if (
    dateIndex.value + direction >= 0 &&
    dateIndex.value + direction < datesLength.value
  ) {
    dateIndex.value += direction
  }
}

const dateChanged = (newDate: Date) => {
  const newDateIndex = userState.userData?.[
    currentTimeframe.value
  ].dates.findIndex((date) => isSameDay(date, newDate))
  if (newDateIndex !== undefined && newDateIndex !== -1) {
    dateIndex.value = newDateIndex
  }
}

const selectedDate = computed<number | undefined>(
  () => userState.userData?.[currentTimeframe.value].dates[dateIndex.value]
)
const selectedDateCal = computed<Date>(() => new Date(selectedDate.value || 0))

const todaySelected = computed(
  () => selectedDate.value && isToday(selectedDate.value)
)

const selectedDateFormatted = computed(() => {
  const selected = selectedDate.value
  const today = new Date()
  if (selected) {
    if (isDaily.value) {
      if (isSameDay(selected, today)) {
        return 'Today'
      } else if (isYesterday(selected)) {
        return 'Yesterday'
      } else if (isTomorrow(selected)) {
        return 'Yesterday'
      }
    } else {
      if (isSameWeek(selected, today)) {
        return 'This week'
      }
    }
    return format(new Date(selectedDate.value), 'EEE do LLL')
  } else {
    return ''
  }
})

// Tasks
const currentTasks = computed<Task[]>(
  () =>
    (selectedDate.value &&
      userState.userData?.[currentTimeframe.value].tasks[selectedDate.value]) ||
    []
)

// const maxScore = computed(() =>
//   currentTasks.value.reduce(
//     (total: number, task: Task) => task.score + total,
//     0
//   )
// )

const totalScore = computed(() =>
  currentTasks.value?.reduce(
    (total: number, task: Task) => (task.done ? total + task.score : total),
    0
  )
)

// Changing tasks
const editMode: Ref<boolean> = ref(false)

const toggleEdit = () => {
  if (editMode.value) {
    saveTasks()
  }
  editMode.value = !editMode.value
}

const canEditTasks = computed(
  () => userState.userAuthorised && todaySelected.value
)

const canCompleteTasks = computed(() => {
  const selected = selectedDate.value
  const validDay = selected && (todaySelected.value || isYesterday(selected))
  const validWeek = selected && isThisWeek(selected)
  return (
    userState.userAuthorised &&
    !editMode.value &&
    (isDaily.value ? validDay : validWeek)
  )
})

const toggleDone = (id: number) => {
  const task = currentTasks.value.find((task) => task.id === id)
  if (canCompleteTasks.value && task) {
    task.done = !task.done
    if (currentTasks.value.every((task) => task.done)) {
      bigConfetti()
    } else if (task.done) {
      smallConfetti()
    }
    saveTasks()
  }
}

// Adding new tasks
const newTask = ref(undefined)
const newScore = ref(1)

const addTask = () => {
  if (newTask.value) {
    currentTasks.value.push({
      description: newTask.value,
      done: false,
      score: newScore.value,
      id: Date.now(),
    })
    newTask.value = undefined
    newScore.value = 1
    saveTasks()
  }
}

const removeTask = (id: number) => {
  currentTasks.value.splice(
    currentTasks.value.findIndex((task) => task.id === id),
    1
  )
}

const smallConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.7 },
  })
}

const bigConfetti = () => {
  var end = Date.now() + 3 * 1000

  ;(function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

const gradient = computed(
  () => gradients[Math.floor(Math.random() * gradients.length)]
)

const darkColorStyle = computed(() => ({
  'background-image': `linear-gradient(0deg, ${shade(
    gradient.value[0],
    0.8
  )} 0%, ${shade(gradient.value[1], 0.8)} 100%)`,
}))

const bgColorStyle = computed(() => ({
  'background-image': `linear-gradient(135deg, ${gradient.value[0]} 0%, ${gradient.value[1]} 100%)`,
}))
</script>
