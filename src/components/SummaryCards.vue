<template>
  <v-row justify="center" class="flex-lg-nowrap">
    <v-col
      :cols="12"
      :sm="4"
      class="flex-md-shrink-1"
      v-for="card in cards"
      :key="card.index"
    >
      <SummaryCard v-bind="card"></SummaryCard>
    </v-col>
  </v-row>
</template>

<script>
import SummaryCard from "./SummaryCard";
export default {
  name: "SummaryCards",
  components: {
    SummaryCard,
  },
  props: {
    name: String,
    newCases: Array,
    totalTests: Array,
    percentPositive: Array,
    rolling7Avg: Array,
    rolling14Avg: Array,
    color: String,
  },
  computed: {
    cards() {
      if (this.newCases) {
        return [
          {
            index: 0,
            value: `${this.newCases[1]}`,
            lastValue: `${this.newCases[0]}`,
            description: "New Cases",
            isIncr: this.isIncr(this.newCases),
            color: this.color,
            loading: false,
          },
          {
            index: 1,
            value: `${this.totalTests[1]}`,
            lastValue: `${this.totalTests[0]}`,
            description: "Total Tests",
            isIncr: this.isIncr(this.totalTests),
            color: this.color,
            loading: false,
          },
          {
            index: 2,
            lastValue: this.renderPercent(this.percentPositive[0]),
            value: this.renderPercent(this.percentPositive[1]),
            description: "Percent Positive",
            isIncr: this.isIncr(this.percentPositive),
            color: this.color,
            loading: false,
          },
          {
            index: 3,
            lastValue: this.renderPercent(this.rolling7Avg[0]),
            value: this.renderPercent(this.rolling7Avg[1]),
            description: "7 Day Avg.",
            isIncr: this.isIncr(this.rolling7Avg),
            color: this.color,
            loading: false,
          },
          {
            index: 4,
            lastValue: this.renderPercent(this.rolling14Avg[0]),
            value: this.renderPercent(this.rolling14Avg[1]),
            description: "14 Day Avg",
            isIncr: this.isIncr(this.rolling14Avg),
            color: this.color,
            loading: false,
          },
        ];
      } else {
        return [
          {
            index: 0,
            loading: true,
          },
          {
            index: 1,
            loading: true,
          },
          {
            index: 2,
            loading: true,
          },
          {
            index: 3,
            loading: true,
          },
          {
            index: 4,
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
        return list[0] < list[1];
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