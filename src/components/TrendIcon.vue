<template>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            color="red"
            v-if="isIncr === 1"
            class="float-right"
            large
            >mdi-trending-up</v-icon
          >
          <v-icon
            v-bind="attrs"
            v-on="on"
            color="green"
            v-else-if="isIncr === -1"
            class="float-right"
            large
            >mdi-trending-down</v-icon
          >
          <v-icon
            v-bind="attrs"
            v-on="on"
            color="black"
            v-else
            class="float-right"
            large
            >mdi-trending-flat</v-icon
          >
        </template>
        <span>Yesterday: {{ lastValue }}</span>
      </v-tooltip>
</template>

<script>
export default {
name: 'TrendIcon',
props: {
    isIncr: Boolean,
    lastValue: String
}
}
</script>

<style>

</style>