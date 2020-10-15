<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card :loading="!newCases">
          <v-container>
            <v-row align="center">
              <v-col>
                <h1 class="text-h2 text-center">{{displayCurrent(newCases)}}</h1>
                <div class="text-subtitle-1 text-center">New Cases</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card :loading="!totalTests">
          <v-container>
            <v-row align="center">
              <v-col>
                <h1 class="text-h2 text-center">{{displayCurrent(totalTests)}}</h1>
                <div class="text-subtitle-1 text-center">Total Tests</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card :loading="!percentPositive">
          <v-container>
            <v-row align="center">
              <v-col>
                <h1 class="text-h2 text-center">{{renderPercent(displayCurrent(percentPositive))}}</h1>
                <div class="text-subtitle-1 text-center">Percent Positive</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card :loading="!rolling7Avg">
          <v-container>
            <v-row align="center">
              <v-col>
                <h1 class="text-h2 text-center">{{renderPercent(displayCurrent(rolling7Avg))}}</h1>
                <div class="text-subtitle-1 text-center">7 Day Avg.</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card :loading="!rolling14Avg">
          <v-container>
            <v-row align="center">
              <v-col>
                <h1 class="text-h2 text-center">{{renderPercent(displayCurrent(rolling14Avg))}}</h1>
                <div class="text-subtitle-1 text-center">14 Day Avg.</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SummmaryGraph",
  props: {
    name: String,
    newCases: Array,
    totalTests: Array,
    percentPositive: Array,
    rolling7Avg: Array,
    rolling14Avg: Array,
    color: String
  },
  methods: {
    renderPercent(percent) {
      return `${(percent * 100).toFixed(2)}%`;
    },
    isIncr(prev, cur) {
      return cur > prev
    },
    displayCurrent(val){
      if(val && val.length > 1){
        return val[1]
      }
    }
  },
};
</script>

<style>
</style>