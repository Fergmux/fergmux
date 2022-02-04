<template>
  <div class="about">
    <h1>This is the chart page</h1>
    <button :disabled="!state.indexes.length" @click="drillup">Go back</button>
    <div style="width: 100%; display: flex; justify-content: center">
      <div
        class="chart-container"
        style="position: relative; height: 100vh; width: 100vh"
      >
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const gameData = [
  {
    key: "Microsoft",
    value: 2358.99,
    children: [
      {
        key: "Xbox Game Studios",
        value: 2221,
        children: [
          { key: "Rare", value: 100, children: [] },
          { key: "343 Industries", value: 100, children: [] },
          { key: "The Coalition", value: 100, children: [] },
          { key: "Mojang", value: 100, children: [] },
          { key: "Ninja Theory", value: 100, children: [] },
          { key: "Playground Games", value: 100, children: [] },
          { key: "Undead labs", value: 100, children: [] },
          { key: "Obsidian Entertainment", value: 100, children: [] },
          { key: "Double Fine", value: 100, children: [] },
        ],
      },
      { key: "Activision Blizzard", value: 61.49, children: [] },
      { key: "Zenimax Media", value: 61.49, children: [] },
    ],
  },
  {
    key: "Other",
    value: 963.8,
    children: [
      { key: "Tencent Games", value: 593.66, children: [] },
      { key: "No Parent", value: 280.52, children: [] },
      { key: "EA", value: 38.8, children: [] },
      { key: "Take-Two Interactive", value: 18.8, children: [] },
      {
        key: "Warner Bros. Interactive Entertainment",
        value: 22.18,
        children: [],
      },
      { key: "Embracer Group", value: 9.84, children: [] },
    ],
  },
  {
    key: "Sony",
    value: 135.36,
    children: [],
  },
  { key: "Nintendo", value: 55, children: [] },
];

const getLabels = (data) => data.map((item) => item.key);
const getData = (data) => data.map((item) => item.value);

const data = {
  labels: getLabels(gameData),
  datasets: [
    {
      label: "My First Dataset",
      data: getData(gameData),
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      hoverOffset: 4,
    },
  ],
};

const About = {
  setup() {
    const chartRef = ref(null);
    const state = reactive({ indexes: [] });
    let chart;

    const refreshChart = () => {
      let currentData = gameData;
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

      state.indexes.push(index);
      refreshChart();
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
        data,
        options: {
          onClick: drilldown,
        },
      });
    });

    return { chartRef, chart, drillup, state };
  },
};

export default About;
</script>
