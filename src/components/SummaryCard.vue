<template>
  <div class="card">
      <h2 class="card-title">{{name}}</h2>
      <ul>
          <li>New Cases: {{newCases}}</li>
          <li>Total Tests: {{totalTests}}</li>
          <li>% Positive: {{renderPercent(percentPositive)}}</li>
          <li>7 Day Avg.: {{renderPercent(rolling7Avg)}}</li>
          <li>14 Day Avg.: {{renderPercent(rolling14Avg)}}</li>
      </ul>
  </div>
</template>

<script>
export default {
    name: 'SummmaryGraph',
    props: {
        name: String,
        newCases: Number,
        totalTests: Number,
        percentPositive: Number,
        rolling7Avg: Number,
        rolling14Avg: Number
    },
    methods: {
        renderPercent(percent){
            return `${(percent * 100).toFixed(2)}%`
        }
    }
}
</script>

<style>
.card {
    width: 400px;
    padding: 1em;
    margin: 0.5em;
    border: 1px gray solid;
}

.card ul {
    padding: 0;
    list-style: none;
}
</style>