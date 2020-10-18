<template>
        <v-card :loading="loading">
          <v-container>
            <v-tooltip bottom>
              <template v-slot:activator="{on, attrs}">
                <v-icon v-bind="attrs" v-on="on" color="red" v-if="isIncr" class="float-right" large>mdi-trending-up</v-icon>
                <v-icon v-bind="attrs" v-on="on" color="green" v-else class="float-right" large>mdi-trending-down</v-icon>
              </template>
              <span>Yesterday: {{lastValue}}</span>
            </v-tooltip>
            <v-row align="center">
              <v-col>
                <h1 class="text-h2 text-center">
                  {{ value }}
                </h1>
                <div class="text-subtitle-1 text-center">{{description}}</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
</template>

<script>
export default {
  name: "SummmaryCard",
  props: {
    value: String,
    lastValue: String,
    description: String,
    isIncr: Boolean,
    loading: Boolean,
    color: String,
  },
};
</script>

<style>

</style>