<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Mid-Hudson Region COVID Trends</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon dark v-bind="attrs" v-on="on">
            <v-icon>mdi-chart-timeline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group :value="timeRangeMode">
            <v-list-item
              @click="selectTimeRange(index)"
              v-for="(option, index) in timeRangeOptions"
              :key="index"
              >{{ option }}</v-list-item
            >
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title> Mid-Hudson COVID Data </v-list-item-title>
          <v-list-item-subtitle> Select a region </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group :value="selectedIndex" :color="selectedColor">
          <v-list-item
            v-for="(county, i) in counties"
            :key="i"
            @click="selectCounty(county)"
          >
            <v-list-item-title>
              {{ county }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="caption text-center">
          Updated at: {{ new Date(updatedTimestamp).toLocaleString() }}
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <SummaryCards v-bind="selectedSummary" :color="selectedColor" />

        <v-row align="center" justify="space-around">
          <v-col :cols="12" :md="6" :lg="5">
            <v-card>
              <v-card-title>New Cases</v-card-title>
              <v-card-text>
                <StackedBarParent
                  :regions="currentCountyData"
                  :colors="colors"
                  :county="selectedCounty"
                  :labels="dates"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="12" :md="6" :lg="5">
            <v-card>
              <v-card-title>Cases per 100k</v-card-title>
              <v-card-text>
                <LineGraphParent
                  :region="selectedCountyData"
                  :labels="getDates(7)"
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
              <v-card-text>
                <LineGraphParent
                  :region="selectedCountyData"
                  :labels="dates"
                  series="percentPositive"
                  :color="selectedColor"
                ></LineGraphParent>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="12" :md="6" :lg="5">
            <v-card>
              <v-card-title>7 Day Rolling Avg.</v-card-title>
              <v-card-text>
                <LineGraphParent
                  :region="selectedCountyData"
                  :labels="getDates(7)"
                  series="rolling7Avg"
                  :color="selectedColor"
                ></LineGraphParent>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SummaryCards from "./components/SummaryCards";
import StackedBarParent from "./components/StackedBarParent";
import LineGraphParent from "./components/LineGraphParent";
import { mapGetters, mapState } from "vuex";
import { sliceData } from "./helpers/dataProcessing";
export default {
  name: "App",

  components: {
    SummaryCards,
    StackedBarParent,
    LineGraphParent,
  },
  data() {
    return {
      drawer: null,
      timeRangeOptions: ["Last 2 Weeks", "Since March 1st"],
    };
  },
  watch: {
    selectedIndex() {
      if (this.$vuetify.breakpoint.mobile) {
        this.drawer = false;
      }
    },
  },
  methods: {
    selectCounty(county) {
      this.$store.commit("SET_COUNTY", county);
    },
    selectTimeRange(index) {
      this.$store.commit("TOGGLE_TIMERANGE", index);
    },
    getDates(offset){
        return this.timeRangeMode === 1 ? this.dates.slice(offset) : this.dates;
    }
  },
  computed: {
    ...mapState([
      "counties",
      "colors",
      "selectedCounty",
      "updatedTimestamp",
      "timeRangeMode",
    ]),
    ...mapGetters([
      "currentCountyData",
      "selectedCountyData",
      "loading",
      "selectedColor",
      "dates",
    ]),
    selectedIndex() {
      return this.counties.indexOf(this.selectedCounty);
    },
    selectedSummary() {
      return {
        ...sliceData(this.selectedCountyData, 2),
        name: this.selectedCounty,
      };
    },
    canLoadSelected() {
      return (
        this.selectedCountyData &&
        JSON.stringify(this.selectedCountyData) !== "{}"
      );
    },
  },
  mounted: function () {
    this.$store.dispatch("getData");
  },
};
</script>
