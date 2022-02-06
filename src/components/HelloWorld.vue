<template>
  <div class="about container mx-auto py-6">
    <h1 class="text-4xl mb-7 underline">Game studio market share</h1>
    <p class="text-lg mb-5">{{ level }}</p>
    <button
      :disabled="!state.indexes.length"
      @click="drillup"
      class="mb-7 px-5 py-2 rounded bg-emerald-400 hover:bg-emerald-500 text-emerald-100 disabled:bg-slate-300 disabled:text-slate-600"
    >
      Go back
    </button>
    <p class="text-sm mb-4">{{ path }}</p>

    <div style="width: 100%; display: flex; justify-content: center">
      <div
        class="chart-container"
        style="position: relative; height: 80vh; width: 80vh"
      >
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, reactive, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
import { gameData, chartData, getLabels, getData } from "@/data/gameData.js";

Chart.register(...registerables);

const levelMap = ["Company", "Group", "Studio/Publisher", "Game/Franchise"];
const tooltipMap = ["B Market Cap", "B Market Cap", "M Revenue", "M Sales"];

export default {
  setup() {
    const chartRef = ref(null);
    const state = reactive({ indexes: [] });

    let chart;
    let currentData = gameData;
    let skippedGroup = false;

    const level = computed(() => levelMap[state.indexes.length]);
    const path = computed(() =>
      state.indexes.length
        ? getKeys(0, gameData[state.indexes[0]]).join(" > ")
        : "Click a segment to get more detail"
    );

    const getKeys = (level, data) => [
      ...(data.children.length === 1 && data.children[0].children.length
        ? []
        : [data.key]),
      ...(level !== state.indexes.length - 1
        ? getKeys(level + 1, data.children[state.indexes[level + 1]])
        : []),
    ];

    const refreshChart = () => {
      currentData = gameData;
      state.indexes.forEach(
        (index) => (currentData = currentData[index].children)
      );

      const prefix = state.indexes.length === 3 ? "" : "$";
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

        if (children.length === 1 && children[0].children.length) {
          skippedGroup = true;
          state.indexes.push(0);
        }

        refreshChart();
      }
    };

    const drillup = () => {
      state.indexes.pop();

      if (skippedGroup && state.indexes.length === 1) {
        state.indexes.pop();
        skippedGroup = false;
      }

      refreshChart();
    };

    onMounted(() => {
      chart = new Chart(chartRef.value, {
        type: "doughnut",
        data: chartData,
        options: {
          onClick: drilldown,
        },
      });
      refreshChart();
    });

    return { chartRef, chart, drillup, state, level, path };
  },
};
</script>
