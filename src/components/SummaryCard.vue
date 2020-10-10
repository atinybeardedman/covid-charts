<template>
  <div class="card">
    <v-card>
      <v-card-title>{{ name }}</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item>New Cases: {{ newCases }}</v-list-item>
          <v-list-item>Total Tests: {{ totalTests }}</v-list-item>
          <v-list-item
            >% Positive: {{ renderPercent(percentPositive) }}</v-list-item
          >
          <v-list-item
            >7 Day Avg.: {{ renderPercent(rolling7Avg) }}</v-list-item
          >
          <v-list-item
            >14 Day Avg.: {{ renderPercent(rolling14Avg) }}</v-list-item
          >
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "SummmaryGraph",
  props: {
    name: String,
    newCases: Number,
    totalTests: Number,
    percentPositive: Number,
    rolling7Avg: Number,
    rolling14Avg: Number,
  },
  methods: {
    renderPercent(percent) {
      return `${(percent * 100).toFixed(2)}%`;
    },
  },
};
</script>

<style>
</style>