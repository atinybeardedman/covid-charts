
<script>
import { Bar } from "vue-chartjs";
export default {
  extends: Bar,
  props: ["chartdata", "labels", "colordict"],
  data: function () {
    return {
      options: {
        responsive: true,
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
              stacked: true,
              ticks: {
                  source: 'labels'
              }
            },
          ],
        },
      },
    };
  },
  computed: {
    dataObj() {
      return {
        labels: this.labels,
        datasets: this.datasets,
      };
    },
    datasets() {
      return Object.keys(this.chartdata)
        .filter((n) => n !== "Region")
        .map((county) => ({
          label: county,
          data: this.chartdata[county].newCases,
          // stack: county,
          backgroundColor: this.colordict[county],
        }))
        .reverse();
    },
  },
  mounted() {
    this.renderChart(this.dataObj, this.options);
    // console.log(this.chartdata)
  },
};
</script>

<style>
</style>