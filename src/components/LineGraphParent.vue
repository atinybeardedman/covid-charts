<template>
  <div v-if="dataReady">
    <LineGraph :chart-data="chartData" :options="this.options"></LineGraph>
  </div>
</template>

<script>
import LineGraph from "./LineGraph";

export default {
  name: "LineGraphParent",
  components: {
    LineGraph,
  },
  props: {
    region: {
      type: Object,
      default: null,
    },
    series: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null,
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
        legend: {
          display: false,
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            label: function (tooltipItem) {
              const label = `${(tooltipItem.value * 100).toFixed(2)}%`;
              return label;
            },
            title: function(tooltipItems){
              let title = '';
              if(tooltipItems.length > 0){
                title = new Date(tooltipItems[0].label).toLocaleDateString();
              }
              return title;
            }
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value) {
                  return `${(value * 100).toFixed(2)}%`;
                },
                suggestedMin: 0
              },
            },
          ],
          xAxes: [
            {
              type: "time",
              unit: "day",
               time: {
                minUnit: 'day'
              },
              ticks: {
                source: "auto",
              },
            },
          ],
        },
      },
    };
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: this.series,
            data: this.region[this.series],
            borderColor: this.color,
            backgroundColor: "rgba(0,0,0,0)",
          },
        ],
      };
    },
    dataReady() {
      return this.series && this.region && this.labels.length > 0;
    },
  },
};
</script>
