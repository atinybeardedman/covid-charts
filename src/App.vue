<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <div>Covid Charts</div>
      </div>

      <v-spacer></v-spacer>
       <v-btn
          v-for="county in counties"
          :key="county"
          text
        >
          {{ county }}
        </v-btn>

    </v-app-bar>

    <v-main>
      <SummaryCard v-bind="summaryCountyData[0]"/>
    </v-main>
  </v-app>
</template>

<script>
import SummaryCard from './components/SummaryCard';
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'App',

  components: {
    SummaryCard,
  },
  computed: {
   ...mapState(['counties']),
    ...mapGetters(['countyData', 'summaryCountyData', 'loading']),
  },
  mounted: function(){
    this.$store.dispatch('getData')
  }
};
</script>
