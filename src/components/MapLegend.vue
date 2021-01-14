<template>
  <v-card>
      <v-card-title>Regional Legend</v-card-title>
      <v-card-text>
          <v-list>
              <v-list-item-group :value="regionIndex">
                <v-list-item v-for="region in regions" :key="region.name" @click="navigate(region.name)">
                    <v-list-item-icon>
                        <v-icon :color="region.color">
                            mdi-checkbox-blank-circle
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{region.name}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
          </v-list>
      </v-card-text>
  </v-card>
</template>

<script>
import { regionDict,colors } from '../constants/constants'
export default {
    name: 'MapLegend',
    props: ['regionName', 'countyName'],
    computed: {
        regions() {
            return Object.keys(regionDict).map((r, index) => ({
                name: r,
                color: colors[index]
            }))
        },
        regionIndex(){
            const index = this.regions.findIndex(r => r.name === this.regionName);
            console.log(index);
            return index;
        }
    },
    methods: {
        navigate(regionName){
            this.$router.push(`/${regionName}/Region`)
        }
    }

}
</script>

<style>

</style>