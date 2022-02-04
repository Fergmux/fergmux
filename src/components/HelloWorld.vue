<template>
  <div class="about">
    <h1 class="text-4xl mb-7 underline">Game studio market share</h1>
    <p class="text-lg mb-5">{{ level }}</p>
    <button
      :disabled="!state.indexes.length"
      @click="drillup"
      class="mb-7 px-5 py-2 rounded bg-emerald-400 hover:bg-emerald-500 text-emerald-100 disabled:bg-slate-300 disabled:text-slate-600"
    >
      Go back
    </button>

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

const levelMap = ["Company", "Group", "Studio", "Game"];

const About = {
  setup() {
    const chartRef = ref(null);
    const state = reactive({ indexes: [] });

    let chart;
    let currentData = gameData;

    const level = computed(() => levelMap[state.indexes.length]);

    const refreshChart = () => {
      currentData = gameData;
      state.indexes.forEach(
        (index) => (currentData = currentData[index].children)
      );
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

      if (currentData[index].children.length) {
        state.indexes.push(index);
        refreshChart();
      }
    };

    const drillup = () => {
      state.indexes.pop();
      refreshChart();
    };

    Chart.overrides.doughnut.plugins.tooltip = {
      callbacks: {
        label: (tooltipItem) => `$${tooltipItem.parsed}B`,
      },
    };

    onMounted(() => {
      chart = new Chart(chartRef.value, {
        type: "doughnut",
        data: chartData,
        options: {
          onClick: drilldown,
        },
      });
    });

    return { chartRef, chart, drillup, state, level };
  },
};

export default About;
</script>
