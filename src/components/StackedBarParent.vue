<template>
  <div v-if="dataReady">
    <StackedBar :chart-data="chartData" :options="this.options"></StackedBar>
  </div>
</template>

<script>
import StackedBar from './StackedBar';
export default {
 name: 'StackedBarParent',
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
    colors: {
      type: Object,
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
         tooltips: {
          displayColors: false,
          callbacks: {
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
              stacked: true,
            },
          ],
          xAxes: [
            {
              type: "time",
              unit: 'day',
              time: {
                minUnit: 'day'
              },
              stacked: true,
              ticks: {
                  source: 'auto'
              }
            },
          ],
        },
      },
    };
  },
  computed: {
      datasets(){
          if(this.county === 'Region'){
              return  Object.keys(this.regions)
                .filter((n) => n !== "Region")
                .map((county) => ({
                    label: county,
                    data: this.regions[county].newCases,
                    backgroundColor: this.colors[county],
                })
                )
                .reverse();
          } else {
              return [
                  {
                    label: this.county,
                    data: this.regions[this.county].newCases,
                    backgroundColor: this.colors[this.county],
                  }
              ]
          }
      },
      chartData(){
          return {
              labels: this.labels,
              datasets: this.datasets
          }

      },
      dataReady() {
          return this.county && this.regions && this.labels.length > 0 && this.colors
      }
  }
};
</script>
