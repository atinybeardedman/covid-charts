<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        v-bind="attrs"
        v-on="on"
        :color="icon.color"
        class="float-right"
        large
        >{{ icon.name }}</v-icon
      >
    </template>
    <span>Yesterday: {{ lastValue }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "TrendIcon",
  props: {
    isIncr: {
      type: Number,
      default: 1,
    },
    lastValue: String,
  },
  computed: {
    icon() {
      switch (this.isIncr) {
        case 1:
          return {
            name: "mdi-trending-up",
            color: "red",
          };
        case -1:
          return {
            name: "mdi-trending-down",
            color: "green",
          };
        default:
          return {
            name: "mdi-trending-neutral",
            color: "black",
          };
      }
    },
  },
};
</script>

<style>
</style>