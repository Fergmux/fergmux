<template>
  <div class="flex flex-col items-center">
    <h1 class="text-4xl mb-7 underline">Wordle solver</h1>

    <div class="grid grid-cols-5 gap-1 m-5 font-bold">
      <div
        v-for="(_, i) in colorList"
        :key="i"
        @click="changeColor(i)"
        :class="{
          'border-2': !colorList[i],
          'bg-zinc-700': colorList[i] === 0 && letterList[i],
          'bg-yellow-600': colorList[i] === 1,
          'bg-green-600': colorList[i] === 2,
        }"
        class="text-center text-4xl leading-relaxed text-gray-100 h-16 w-16 border-neutral-700 flex items-center justify-center"
      >
        <p>
          {{ letterList[i] }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-11 gap-1 m-5 font-semibold">
      <div
        v-for="letter in letters"
        :key="letter"
        class="p-2 rounded bg-gray-500 text-white cursor-pointer active:bg-gray-700 h-12 flex items-center justify-center select-none"
        :class="{
          'col-span-2': ['Reset', 'Enter', 'backspace'].includes(letter),
          'material-icons-outlined text-base': [
            'palette',
            'backspace',
          ].includes(letter),
        }"
        @click="handleKeyPress({ key: letter })"
      >
        {{ letter.length > 1 ? letter : letter.toUpperCase() }}
      </div>
    </div>

    <div class="flex">
      <div class="m-4">
        <b class="text-xl">Most likely:</b>
        <div class="grid grid-cols-2 gap-4 m-5">
          <div v-for="word in likelyWords" :key="word">
            {{ word.toUpperCase() }}
          </div>
        </div>
      </div>

      <div class="m-4">
        <b class="text-xl">Most information:</b>
        <div class="grid grid-cols-2 gap-4 m-5">
          <div v-for="word in informativeWords" :key="word">
            {{ word.toUpperCase() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import indexesOf from 'indexes-of'
import words from '@/data/words.js'
import ordinal from 'ordinal'
import { computed, ref, onMounted, inject } from 'vue'

export default {
  setup() {
    // CONSTANTS //
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
    const letters = ref(
      'q,w,e,r,t,y,u,i,o,p,palette,a,s,d,f,g,h,j,k,l,backspace,Reset,z,x,c,v,b,n,m,Enter'.split(
        ','
      )
    )

    // METHODS //
    const aIndex = (letter) => alphabet.indexOf(letter)

    const unique = (value, index, self) => self.indexOf(value) === index

    const getLetterWeights = (letters) => {
      const letterCount = Array(26).fill(0)

      letters.forEach((letter) => letterCount[aIndex(letter)]++)

      const totalLetters = letterCount.reduce((a, b) => a + b)

      return letterCount.map((count) => count / totalLetters)
    }

    // LOGIC //

    // Letter frequency //
    const letterWeights = getLetterWeights([...words.join('')])

    const wordScores = words.map((word) => [
      word,
      [...word]
        .filter(unique)
        .map((letter) => letterWeights[aIndex(letter)])
        .reduce((a, b) => a + b),
    ])
    wordScores.sort((a, b) => b[1] - a[1])

    // Position frequency //
    const orderedLetters = [0, 1, 2, 3, 4].map((index) =>
      words.map((word) => word[index])
    )

    const pLetterWeights = orderedLetters.map((letters) =>
      getLetterWeights(letters)
    )

    const pLetterScores = words.map((word) => [
      word,
      [...word]
        .filter(unique)
        .map((letter, index) => pLetterWeights[index][aIndex(letter)])
        .reduce((a, b) => a + b),
    ])
    pLetterScores.sort((a, b) => b[1] - a[1])

    onMounted(() => {
      printHelp()
    })

    const grey = []
    const green = [null, null, null, null, null]
    const yellow = [[], [], [], [], []]
    const mostInformative = ref([])
    const mostLikely = ref([])

    const likelyWords = computed(() =>
      mostLikely.value.map((word) => word[0]).slice(0, 10)
    )
    const informativeWords = computed(() =>
      mostInformative.value.map((word) => word[0]).slice(0, 10)
    )

    const printHelp = () => {
      const usedLetters = [
        ...grey,
        ...green.filter((x) => x),
        ...yellow.flat(2),
      ]

      mostInformative.value = wordScores.filter(
        (entry) => ![...entry[0]].some((letter) => usedLetters.includes(letter))
      )

      mostLikely.value = pLetterScores
        .filter(
          (entry) =>
            ![...entry[0]].some((letter) =>
              grey
                .filter(
                  (_letter) => ![...green, ...yellow.flat(2)].includes(_letter)
                )
                .includes(letter)
            )
        ) // Doesn't include any grey letters
        .filter((entry) =>
          yellow.flat(2).every((letter) => entry[0].includes(letter))
        ) // Includes all yellow letters
        .filter((entry) =>
          green.every(
            (letter, index) => !letter || [...entry][0][index] === letter
          )
        ) // Has green in the correct place
        .filter((entry) =>
          yellow.every((letters, index) => !letters.includes(entry[0][index]))
        ) // Has no yellows in invalid places
    }

    const guessCount = ref(0)
    const wordStart = computed(() => guessCount.value * 5)
    const wordEnd = computed(() => guessCount.value * 5 + 5)
    const guess = computed(() =>
      letterList.value
        .slice(wordStart.value, wordEnd.value)
        .join('')
        .toLowerCase()
    )

    const toast = inject('$toast')

    const submitWord = () => {
      if (guess.value.length !== 5 || !words.includes(guess.value)) {
        toast('Invalid word', {
          styles: { background: dark.value ? '#111' : '#fff' },
        })
        return
      } else {
        toast('Accepted!', {
          styles: { background: dark.value ? '#111' : '#fff' },
        })
      }
      const infoGuess = mostInformative.value
        .map((entry) => entry[0])
        .indexOf(guess.value)
      const probGuess = mostLikely.value
        .map((entry) => entry[0])
        .indexOf(guess.value)

      if (infoGuess !== -1) {
        console.log(
          `Your guess was the ${ordinal(
            infoGuess + 1
          )} most informative word out of ${mostInformative.value.length}`
        )
      }
      if (probGuess !== -1) {
        console.log(
          `Your guess was the ${ordinal(
            probGuess + 1
          )} most likely word out of ${mostLikely.value.length}`
        )
      }

      const results = colorList.value.slice(wordStart.value, wordEnd.value)

      grey.push(...indexesOf(results, 0).map((index) => guess.value[index]))
      indexesOf(results, 1).forEach((index) =>
        yellow[index].push(guess.value[index])
      )
      indexesOf(results, 2).forEach(
        (index) => (green[index] = guess.value[index])
      )

      printHelp()

      guessCount.value++
    }

    const changeColor = (index) => {
      if (index >= wordStart.value && index < wordEnd.value) {
        colorList.value[index] = (colorList.value[index] + 1) % 3
      }
    }

    const letterList = ref([])
    const colorList = ref(Array(30).fill(0))

    const reset = () => {
      letterList.value = []
      colorList.value.fill(0)
      grey.length = 0
      green.fill(null)
      yellow.fill([])
      mostInformative.value = []
      mostLikely.value = []
      guessCount.value = 0
      printHelp()
    }

    const dark = inject('dark')

    const handleKeyPress = (event) => {
      if (event.key.match(/^[a-zA-Z]$/)) {
        if (letterList.value.length < wordEnd.value) {
          letterList.value.push(event.key.toUpperCase())
        }
      } else if (event.key.toLowerCase() === 'backspace') {
        if (letterList.value.length > wordStart.value) {
          letterList.value.pop()
        }
      } else if (event.key === 'Enter') {
        submitWord()
      } else if (event.key === 'Reset') {
        reset()
      } else if (event.key === 'palette') {
        changeColor(letterList.value.length)
      }
    }

    document.addEventListener('keydown', (event) => {
      handleKeyPress(event)
    })

    const keyboard = ref()

    const showKeyboard = () => {
      keyboard.value.focus()
    }

    return {
      letters,
      keyboard,
      likelyWords,
      informativeWords,
      letterList,
      colorList,
      wordEnd,
      submitWord,
      changeColor,
      reset,
      showKeyboard,
      handleKeyPress,
    }
  },
}
</script>
