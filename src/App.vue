<template>
<div class="app">
  <summary-card v-bind="summaryCountyData[0]"/>
</div>
</template>

<script>
import SummaryCard from './components/SummaryCard.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    SummaryCard
  },
  computed: {
   
    ...mapGetters(['countyData', 'summaryCountyData', 'loading']),
  },
  mounted: function(){
    this.$store.dispatch('getData')
  }
}
</script>

<style>

</style>
