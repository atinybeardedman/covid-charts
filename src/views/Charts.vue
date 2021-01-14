<template>
  <v-container fluid>
    <div v-if="loading">Loading...</div>
    <section v-else>
      <SummaryCards v-bind="selectedSummary" :color="selectedColor" />

      <v-row align="center" justify="space-around">
        <v-col :cols="12" :md="6" :lg="5">
          <v-card>
            <v-card-title>New Cases</v-card-title>
            <v-card-subtitle>Daily Reported Positives</v-card-subtitle>
            <v-card-text>
              <StackedBarParent
                :regions="currentRegionData"
                :colors="colors"
                :county="county"
                :countyIndex="selectedIndex"
                :labels="getDates(14)"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="12" :md="6" :lg="5">
          <v-card>
            <v-card-title>Cases per 100k</v-card-title>
            <v-card-subtitle>7 Day Rolling Average</v-card-subtitle>
            <v-card-text>
              <LineGraphParent
                :region="selectedCountyData"
                :labels="getDates(14)"
                series="rollingCaseAvg"
                :color="selectedColor"
                graphType="number"
              ></LineGraphParent>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="12" :md="6" :lg="5">
          <v-card>
            <v-card-title>Percent Positive</v-card-title>
            <v-card-subtitle>Postive Tests per Total Tests Administered</v-card-subtitle>
            <v-card-text>
              <LineGraphParent
                :region="selectedCountyData"
                :labels="getDates(14)"
                series="percentPositive"
                :color="selectedColor"
              ></LineGraphParent>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="12" :md="6" :lg="5">
          <v-card>
            <v-card-title>Average Percent Positive</v-card-title>
            <v-card-subtitle>7 Day Rolling Average</v-card-subtitle>
            <v-card-text>
              <LineGraphParent
                :region="selectedCountyData"
                :labels="getDates(14)"
                series="rolling7Avg"
                :color="selectedColor"
              ></LineGraphParent>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import LineGraphParent from "../components/LineGraphParent";
import StackedBarParent from "../components/StackedBarParent";
import SummaryCards from "../components/SummaryCards";
import { sliceData } from "../helpers/dataProcessing";
import { colors } from "../constants/constants";
export default {
  name: "charts",
  props: ["region", "county"],
  data() {
    return {
      colors,
    };
  },
  components: {
    LineGraphParent,
    StackedBarParent,
    SummaryCards,
  },
  methods: {
    getDates(total) {
      const length = this.dates.length;
      return this.dates.slice(length - total);
    },
    async updateRegion(region) {
      if (!this.$store.state.regionData[region]) {
        this.$store.commit("SET_LOADING", true);
        await this.$store.dispatch("getData", region);
      }
      this.$store.commit("SET_REGION", region);
    },
  },
  computed: {
    ...mapState([
      "timeRangeMode",
      "selectedIndex",
      "loading",
      "currentRegionData",
      "selectedCountyData",
    ]),
    ...mapGetters(["dates", "selectedColor"]),
    selectedSummary() {
      return {
        ...sliceData(this.selectedCountyData, 2),
        name: this.selectedCounty,
      };
    },
  },
  beforeRouteUpdate(to, from, next) {
    const newCounty = to.params.county;
    const newRegion = to.params.region;
    if (newRegion !== from.params.region) {
      this.updateRegion(newRegion).then(() => {
        this.$store.commit("SET_COUNTY", newCounty);
        this.$store.commit("SET_LOADING", false);
      });
    } else if (newCounty !== from.params.county) {
      this.$store.commit("SET_COUNTY", newCounty);
    }
    next();
  },
  created() {
    this.updateRegion(this.region).then(() => {
      this.$store.commit("SET_COUNTY", this.county);
      this.$store.commit("SET_LOADING", false);
    });
  },
};
</script>

<style>
</style>