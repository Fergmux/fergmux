<template>
  <div class="about container mx-auto py-6 flex flex-col items-center">
    <h1 class="text-4xl mb-7 underline">Game studio market share</h1>

    <simple-typeahead
      ref="searchBar"
      id="search-bar"
      placeholder="Search for a studio or game"
      :items="itemKeyList"
      :minInputLength="1"
      @selectItem="selectSearchItem($event, gameData)"
      @onFocus="fieldFocus = true"
      @onBlur="fieldFocus = false"
    />

    <div class="flex justify-center items-center mt-5">
      <span
        v-if="state.indexes.length"
        @click="resetChart"
        class="material-icons md-dark cursor-pointer mr-2 text-base items-baseline"
      >
        home
      </span>

      <p class="text-sm">{{ pagePath }}</p>

      <span
        v-if="state.indexes.length"
        @click="drillup"
        class="material-icons md-dark cursor-pointer ml-2 text-base items-baseline"
      >
        subdirectory_arrow_left
      </span>
    </div>

    <p class="text-lg mt-1">{{ level }}</p>

    <div class="flex justify-center mt-5">
      <div class="relative chart-container max-w-screen-sm" style="width: 80vw">
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, reactive, onMounted, onUnmounted } from "vue";
import { Chart, registerables } from "chart.js";
import SimpleTypeahead from "vue3-simple-typeahead";
import {
  chartConfig,
  gameData,
  getData,
  getLabels,
  levelMap,
  tooltipMap,
} from "@/data/gameData.js";

Chart.register(...registerables);

export default {
  components: {
    SimpleTypeahead,
  },
  setup() {
    let keydown;
    const fieldFocused = ref(false);

    onMounted(() => {
      const searchInput = document.getElementById("search-bar");
      keydown = document.addEventListener("keydown", function (event) {
        if (!fieldFocused.value) {
          if (event.key === "Backspace") {
            drillup();
          }
          if (event.key === "h") {
            resetChart();
          }
          if (event.key === "l") {
            event.preventDefault();
            searchInput.focus();
          }
        }
        if (event.key === "Escape") {
          if (searchBar.value.input) {
            searchBar.value.input = "";
          } else {
            searchInput.blur();
          }
        }
      });
    });

    onUnmounted(() => {
      const searchInput = document.getElementById("search-bar");
      searchInput.removeEventListener("focus", focus);
      searchInput.removeEventListener("blur", blur);
      document.removeEventListener("keydown", keydown);
    });

    const chartRef = ref(null);
    const searchBar = ref(null);
    let chart;

    onMounted(() => {
      chart = new Chart(chartRef.value, {
        ...chartConfig,
        options: {
          onClick: drilldown,
        },
      });

      refreshChart();
    });

    const state = reactive({ indexes: [] });
    let currentData;

    const refreshChart = () => {
      currentData = gameData;

      state.indexes.forEach(
        (index) => (currentData = currentData[index].children)
      );

      const prefix = state.indexes.length === 3 ? " " : " $";
      const suffix = tooltipMap[state.indexes.length];

      Chart.overrides.doughnut.plugins.tooltip = {
        callbacks: {
          label: (tooltipItem) => prefix + tooltipItem.parsed + suffix,
        },
      };

      chart.data.labels = getLabels(currentData);
      chart.data.datasets[0].data = getData(currentData);
      chart.update();
    };

    let skippedGroup = false;

    const drilldown = (event) => {
      const index = chart.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        true
      )[0].index;

      const children = currentData[index].children;

      if (children.length) {
        state.indexes.push(index);

        if (isOneChildParent(children)) {
          skippedGroup = true;
          state.indexes.push(0);
        }

        refreshChart();
      }
    };

    const isOneChildParent = (children) =>
      children.length === 1 && children[0].children.length;

    const drillup = () => {
      state.indexes.pop();

      if (skippedGroup && state.indexes.length === 1) {
        state.indexes.pop();
        skippedGroup = false;
      }

      refreshChart();
    };

    const level = computed(() => levelMap[state.indexes.length]);

    const itemKeyList = computed(() =>
      getItemKeys(gameData)
        .flat()
        .filter((a) => a)
    );

    const getItemKeys = (data) =>
      data.map((game) => [game.key, ...getItemKeys(game.children).flat()]);

    const pagePath = computed(() =>
      state.indexes.length
        ? getPagePath(0, gameData[state.indexes[0]])
            .filter((a) => a)
            .join(" > ")
        : "Click a segment to get more detail"
    );

    const getPagePath = (level, data) => [
      data.key,
      ...(level !== state.indexes.length - 1
        ? getPagePath(level + 1, data.children[state.indexes[level + 1]])
        : []),
    ];

    const resetChart = () => {
      state.indexes = [];
      refreshChart();
    };

    const selectSearchItem = (item) => {
      const indexes = [];

      const getIndexOfSearch = (search, data) =>
        data.findIndex((game) => {
          if (game.key === search) {
            return true;
          } else {
            const i = getIndexOfSearch(search, game.children);
            if (i >= 0) {
              if (isOneChildParent(game.children)) {
                skippedGroup = true;
              }
              indexes.push(i);
              return true;
            }
          }
        });

      indexes.push(getIndexOfSearch(item, gameData));
      indexes.splice(0, 1);
      indexes.reverse();
      state.indexes = indexes;

      refreshChart();
    };

    return {
      chart,
      chartRef,
      itemKeyList,
      fieldFocused,
      level,
      pagePath,
      searchBar,
      state,
      drillup,
      resetChart,
      selectSearchItem,
    };
  },
};
</script>

<style lang="scss">
.simple-typeahead {
  position: relative;
  width: 80vw;
  max-width: 500px;

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

    &-item-active {
      background-color: rgb(0, 0, 0, 0.05);
    }
  }
}
</style>
