<template>
  <div class="mt-10">
    <input type="text" v-model="inputWord" />
    <input type="text" v-model="colors" />
    <button @click="submitWord">Submit</button>
    <br />
    The words that it's most likely to be are:
    <ul>
      <li v-for="word in likelyWords" :key="word">
        {{ word }}
      </li>
    </ul>
    <br />
    The words that will give you the most information are:
    <ul>
      <li v-for="word in informativeWords" :key="word">
        {{ word }}
      </li>
    </ul>
  </div>
</template>

<script>
import indexesOf from 'indexes-of'
import words from '@/data/words.js'
import ordinal from 'ordinal'
import { computed, ref, onMounted } from 'vue'

export default {
  setup() {
    const wordList = ref(words)

    // CONSTANTS //
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

    // METHODS //
    const aIndex = (letter) => alphabet.indexOf(letter)

    const unique = (value, index, self) => self.indexOf(value) === index

    const getLetterWeights = (letters) => {
      const letterCount = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ]

      letters.forEach((letter) => letterCount[aIndex(letter)]++)

      const totalLetters = letterCount.reduce((a, b) => a + b)

      return letterCount.map((count) => count / totalLetters)
    }

    // LOGIC //

    // Letter frequency //
    const letterWeights = getLetterWeights([...wordList.value.join('')])

    const wordScores = wordList.value.map((word) => [
      word,
      [...word]
        .filter(unique)
        .map((letter) => letterWeights[aIndex(letter)])
        .reduce((a, b) => a + b),
    ])
    wordScores.sort((a, b) => b[1] - a[1])

    // Position frequency //
    const orderedLetters = [0, 1, 2, 3, 4].map((index) =>
      wordList.value.map((word) => word[index])
    )

    const pLetterWeights = orderedLetters.map((letters) =>
      getLetterWeights(letters)
    )

    const pLetterScores = wordList.value.map((word) => [
      word,
      [...word]
        .filter(unique)
        .map(
          (letter, letterIndex) => pLetterWeights[letterIndex][aIndex(letter)]
        )
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

    const submitWord = () => {
      const guess = inputWord.value
      const infoGuess = mostInformative.value
        .map((entry) => entry[0])
        .indexOf(guess)
      const probGuess = mostLikely.value.map((entry) => entry[0]).indexOf(guess)

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

      const results = colors.value

      grey.push(...indexesOf(results, '-').map((index) => guess[index]))
      indexesOf(results, 'y').forEach((index) =>
        yellow[index].push(guess[index])
      )
      indexesOf(results, 'g').forEach((index) => (green[index] = guess[index]))

      printHelp()
    }

    const inputWord = ref('')
    const colors = ref('')

    return {
      inputWord,
      colors,
      wordList,
      likelyWords,
      informativeWords,
      submitWord,
    }
  },
}
</script>

<style>
input {
  border: 1px solid black;
  width: 100px;
}
</style>
