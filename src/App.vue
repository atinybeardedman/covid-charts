<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <div>Covid Charts</div>
      </div>

      <v-spacer></v-spacer>
      <v-btn v-for="county in counties" :key="county" text>
        {{ county }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row align="center">
          <v-col :cols="4">
            <SummaryCard v-bind="summaryCountyData[0]" />
          </v-col>
          <v-col :cols="5">
            <StackedBar
              v-if="!loading"
              :colordict="colors"
              :chartdata="recentCountyData"
              :labels="recentDates"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SummaryCard from "./components/SummaryCard";
import StackedBar from "./components/StackedBar";
import { mapGetters, mapState } from "vuex";
export default {
  name: "App",

  components: {
    SummaryCard,
    StackedBar,
  },
  computed: {
    ...mapState(["counties", "colors"]),
    ...mapGetters([
      "recentCountyData",
      "summaryCountyData",
      "loading",
      "recentDates",
    ]),
  },
  mounted: function () {
    this.$store.dispatch("getData");
  },
};
</script>
