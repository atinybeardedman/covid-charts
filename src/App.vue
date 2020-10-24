<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Mid-Hudson Region COVID Trends</v-toolbar-title>
      <v-spacer></v-spacer>
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
                  :regions="recentCountyData"
                  :colors="colors"
                  :county="selectedCounty"
                  :labels="recentDates"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="12" :md="6" :lg="5">
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
          <v-col :cols="12" :md="6" :lg="5">
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
          <v-col :cols="12" :md="6" :lg="5">
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
    };
  },
  watch: {
    selectedIndex () {
      if(this.$vuetify.breakpoint.mobile){

        this.drawer = false;
      }
    }
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
    selectedIndex() {
      return this.counties.indexOf(this.selectedCounty);
    },
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
