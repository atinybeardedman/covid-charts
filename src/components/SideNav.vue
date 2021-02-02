<template>
    <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title> NYS COVID Data </v-list-item-title>
        <v-list-item-subtitle> Select a region </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list nav dense>
      <v-list-group
        sub-group
        v-for="(counties, regionName, index) in regions"
        :key="regionName"
        :value="regionName == selectedRegion"
        :color="colors[index]"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>{{ regionName }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item :to="`/${regionName}/Region`" :exact="true" color="#000">
          <v-list-item-title>Regional</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-for="(county, i) in counties"
          :key="i"
          :to="`/${regionName}/${county}`"
          :color="colors[i]"
          @click="handleClick()"
        >
          <v-list-item-title>
            {{ county }}
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
   
    </div>
</template>

<script>
import { mapState} from "vuex";
export default {
  name: "SideNav",
  methods: {
    handleClick() {
     
      if (this.$vuetify.breakpoint.mobile) {
          this.$emit("closeDrawer", false);
      }
    },
  },
  computed: {
    ...mapState(["regions", "colors", "selectedRegion"]),

  },
 
};
</script>

<style>
</style>