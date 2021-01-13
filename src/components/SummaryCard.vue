<template>
  <v-card :loading="loading">
    <v-container>
      <TrendIcon :isIncr="isIncr" :lastValue="lastValue" />
      <v-row align="center">
        <v-col>
          <h4 class="text-h4 text-center">
            {{ value }}
          </h4>
          <div class="text-subtitle-1 text-center">{{ description }}</div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import TrendIcon from './TrendIcon';
export default {
  name: "SummmaryCard",
  components: {
    TrendIcon
  },
  props: {
    value: String,
    lastValue: String,
    description: String,
    isIncr: Number,
    loading: Boolean,
    color: String,
  },
};
</script>

<style>
</style>