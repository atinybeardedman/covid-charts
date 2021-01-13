<template>
  <v-row
    v-if="$vuetify.breakpoint.mdAndUp"
    justify="center"
    class="flex-lg-nowrap"
  >
    <v-col
      :cols="12"
      :sm="4"
      class="flex-md-shrink-1"
      v-for="(card, i) in cards"
      :key="i"
    >
      <SummaryCard v-bind="card"></SummaryCard>
    </v-col>
  </v-row>
  <v-row v-else justify="center">
    <v-col>
      <CollatedSummaryCard :name="name" :dataSet="cards" />
    </v-col>
  </v-row>
</template>

<script>
import SummaryCard from "./SummaryCard";
import CollatedSummaryCard from "./CollatedSummaryCard";
export default {
  name: "SummaryCards",
  components: {
    SummaryCard,
    CollatedSummaryCard,
  },
  props: {
    name: String,
    newCases: Array,
    totalTests: Array,
    percentPositive: Array,
    rolling7Avg: Array,
    rollingCaseAvg: Array,
    color: String,
  },
  computed: {
    cards() {
      if (this.newCases) {
        return [
          {
            value: `${this.newCases[1]}`,
            lastValue: `${this.newCases[0]}`,
            description: "New Cases",
            isIncr: this.isIncr(this.newCases),
            color: this.color,
            loading: false,
          },
          {
            value: `${this.totalTests[1]}`,
            lastValue: `${this.totalTests[0]}`,
            description: "Total Tests",
            isIncr: this.isIncr(this.totalTests),
            color: this.color,
            loading: false,
          },
          {
            lastValue: `${this.rollingCaseAvg[0]}`,
            value: `${this.rollingCaseAvg[1]}`,
            description: "7 Day Cases Per 100k",
            isIncr: this.isIncr(this.rollingCaseAvg),
            color: this.color,
            loading: false,
          },
          {
            lastValue: this.renderPercent(this.percentPositive[0]),
            value: this.renderPercent(this.percentPositive[1]),
            description: "% Positive",
            isIncr: this.isIncr(this.percentPositive),
            color: this.color,
            loading: false,
          },
          {
            lastValue: this.renderPercent(this.rolling7Avg[0]),
            value: this.renderPercent(this.rolling7Avg[1]),
            description: "7 Day Avg.",
            isIncr: this.isIncr(this.rolling7Avg),
            color: this.color,
            loading: false,
          },
        ];
      } else {
        return [
          {
            loading: true,
          },
          {
            loading: true,
          },
          {
            loading: true,
          },
          {
            loading: true,
          },
          {
            loading: true,
          },
        ];
      }
    },
  },
  methods: {
    renderPercent(percent) {
      return `${(percent * 100).toFixed(2)}%`;
    },
    isIncr(list) {
      if (list && list.length > 1) {
        if(list[0] == list[1]){
          return 0
        } else if(list[0] < list[1]){
          return 1
        } else {
          return -1;
        }
      }
      return false;
    },
    displayCurrent(val) {
      if (val && val.length > 1) {
        return val[1];
      }
    },
  },
};
</script>

<style>
</style>