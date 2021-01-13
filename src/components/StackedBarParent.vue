<template>
  <div v-if="dataReady">
    <StackedBar :chart-data="chartData" :options="this.options"></StackedBar>
  </div>
</template>

<script>
import StackedBar from "./StackedBar";
export default {
  name: "StackedBarParent",
  components: {
    StackedBar,
  },
  props: {
    regions: {
      type: Object,
      default: null,
    },
    county: {
      type: String,
      default: null,
    },
    countyIndex: {
      type: Number,
      default: 0,
    },
    colors: {
      type: Array,
      default: function () {
        return [];
      },
    },
    labels: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      options: {
        responsive: true,
        tooltips: {
          displayColors: false,
          callbacks: {
            title: function (tooltipItems) {
              let title = "";
              if (tooltipItems.length > 0) {
                title = new Date(tooltipItems[0].label).toLocaleDateString();
              }
              return title;
            },
          },
        },
        legend: {
          labels: {
            generateLabels: function (chart) {
              return chart.data.datasets.map((dataset) => {
                return {
                  text: dataset.label,
                  fillStyle: dataset.backgroundColor,
                  strokeStyle: 'black',
                  lineWidth: 1
                };
              });
            },
          },
        },
        scales: {
          yAxes: [
            {
              stacked: true,
            },
          ],
          xAxes: [
            {
              type: "time",
              unit: "day",
              time: {
                minUnit: "day",
              },
              stacked: true,
              ticks: {
                source: "auto",
              },
            },
          ],
        },
      },
      chartData: {},
      dataReady: false,
    };
  },
  methods: {
    generateDataset() {
      if (this.county === "Region") {
        return Object.keys(this.regions)
          .filter((n) => n !== "Region")
          .map((county, i) => ({
            label: county,
            data: this.regions[county].newCases,
            backgroundColor: this.colors[i],
          }))
          .reverse();
      } else {
        return [
          {
            label: this.county,
            data: this.regions[this.county].newCases,
            backgroundColor: this.colors[this.countyIndex],
          },
        ];
      }
    },
  },
  watch: {
    county: {
      immediate: true,
      handler() {
        this.chartData = {
          labels: this.labels,
          datasets: this.generateDataset(),
        };
        this.dataReady = true;
      },
    },
  },
};
</script>
