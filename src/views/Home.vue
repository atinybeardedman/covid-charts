<template>
  <v-container fluid>
    <v-row>
      <v-col :md="6">
        <h2 class="text-lg-h2 text-h4 pa-2">NYS Regional Covid Dashboard</h2>
        <p class="pa-2">This dashboard provides New York State COVID-19 data and collates it by region and county to more easily track how COVID is spreading in the state. Choose a county of interest either on the interactive map below or the menu on the side.</p>
      </v-col>
    </v-row>
    <v-row align="center" justify="space-around">
      <v-col :cols="12" :md="6">
        <NewYorkMap v-on:region-hover="updateRegion($event)"/>
      </v-col>
      <v-col :md="3">
        <MapLegend :regionName="hoveredRegion" />
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import NewYorkMap from "../components/NewYorkMap";
import MapLegend from "../components/MapLegend";
export default {
  name: "home",
  data(){
    return {
      hoveredRegion: ''
    }
  },
  methods: {
    updateRegion(region){
      this.hoveredRegion = region; 
    }
  },
  components: {
    NewYorkMap,
    MapLegend
  }
}
</script>