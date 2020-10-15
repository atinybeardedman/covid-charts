<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <div>Covid Charts</div>
      </div>

      <v-spacer></v-spacer>
      <v-btn @click="selectCounty(county)" v-for="county in counties" :key="county" text>
        {{ county }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          
          <v-col>
            <SummaryCard v-bind="selectedCountySummary" :color="selectedColor" />
          </v-col>
        </v-row>
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
              <v-card-title>Percent Positive</v-card-title>
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
import SummaryCard from "./components/SummaryCard";
import StackedBar from "./components/StackedBar";
import LineGraphParent from "./components/LineGraphParent";
import { mapGetters, mapState } from "vuex";
export default {
  name: "App",

  components: {
    SummaryCard,
    StackedBar,
    LineGraphParent,
  },
  methods: {
    selectCounty(county){
      this.$store.commit('SET_COUNTY', county)
    }
  },
  computed: {
    ...mapState(["counties", "colors"]),
    ...mapGetters([
      "recentCountyData",
      "selectedCountySummary",
      "selectedRecentCountyData",
      "loading",
      "selectedColor",
      "recentDates",
    ]),
    canLoadSelected () {
      return this.selectedRecentCountyData && JSON.stringify(this.selectedRecentCountyData) !== '{}'
    }
  },
  mounted: function () {
    this.$store.dispatch("getData");
  },
};
</script>
