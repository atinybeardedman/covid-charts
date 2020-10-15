<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-container>
            <v-row align="center">
              <v-col>
                <h1 class="text-h2 text-center">{{newCases}}</h1>
                <div class="text-subtitle-1 text-center">New Cases</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-container>
            <v-row align="center">
              <v-col>
                <h1 class="text-h2 text-center">{{totalTests}}</h1>
                <div class="text-subtitle-1 text-center">Total Tests</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-container>
            <v-row align="center">
              <v-col>
                <h1 class="text-h2 text-center">{{renderPercent(percentPositive)}}</h1>
                <div class="text-subtitle-1 text-center">Percent Positive</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-container>
            <v-row align="center">
              <v-col>
                <h1 class="text-h2 text-center">{{renderPercent(rolling7Avg)}}</h1>
                <div class="text-subtitle-1 text-center">7 Day Avg.</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-container>
            <v-row align="center">
              <v-col>
                <h1 class="text-h2 text-center">{{renderPercent(rolling14Avg)}}</h1>
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
    newCases: Number,
    totalTests: Number,
    percentPositive: Number,
    rolling7Avg: Number,
    rolling14Avg: Number,
    color: String
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