<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Mid-Hudson Region COVID Trends</v-toolbar-title>
      <v-spacer></v-spacer>
      <div>Last updated at: {{ new Date(updatedTimestamp).toLocaleString() }}</div>
      <v-spacer></v-spacer>
      <v-btn
        @click="selectCounty(county)"
        v-for="county in counties"
        :key="county"
        text
      >
        {{ county }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
            <SummaryCards v-bind="selectedSummary" :color="selectedColor" />
      
        <v-row align="center">
          <v-col :cols="4">
            <v-card>
              <v-card-title>Percent Positive</v-card-title>
              <v-card-text>
                <LineGraphParent
                  :region="selectedRecentCountyData"
                  :labels="recentDates"
                  series="percentPositive"
                  :color="selectedColor"
                ></LineGraphParent>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="4">
            <v-card>
              <v-card-title>7 Day Rolling Avg.</v-card-title>
              <v-card-text>
                <LineGraphParent
                  :region="selectedRecentCountyData"
                  :labels="recentDates"
                  series="rolling7Avg"
                  :color="selectedColor"
                ></LineGraphParent>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="4">
            <v-card>
              <v-card-title>14 Day Rolling Avg.</v-card-title>
              <v-card-text>
                <LineGraphParent
                  :region="selectedRecentCountyData"
                  :labels="recentDates"
                  series="rolling14Avg"
                  :color="selectedColor"
                ></LineGraphParent>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-spacer></v-spacer>
          <v-col :cols="5">
            <StackedBar
              v-if="!loading"
              :colordict="colors"
              :chartdata="recentCountyData"
              :labels="recentDates"
          /></v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SummaryCards from "./components/SummaryCards";
import StackedBar from "./components/StackedBar";
import LineGraphParent from "./components/LineGraphParent";
import { mapGetters, mapState } from "vuex";
import { sliceData } from "./helpers/dataProcessing";
export default {
  name: "App",

  components: {
    SummaryCards,
    StackedBar,
    LineGraphParent,
  },
  methods: {
    selectCounty(county) {
      this.$store.commit("SET_COUNTY", county);
    },
  },
  computed: {
    ...mapState(["counties", "colors", "selectedCounty", "updatedTimestamp"]),
    ...mapGetters([
      "recentCountyData",
      "selectedRecentCountyData",
      "loading",
      "selectedColor",
      "recentDates",
    ]),
    selectedSummary() {
      return {
        ...sliceData(this.selectedRecentCountyData, 2),
        name: this.selectedCounty,
      };
    },
    canLoadSelected() {
      return (
        this.selectedRecentCountyData &&
        JSON.stringify(this.selectedRecentCountyData) !== "{}"
      );
    },
  },
  mounted: function () {
    this.$store.dispatch("getData");
    // this.$store.dispatch("getTimestamp")
  },
};
</script>
