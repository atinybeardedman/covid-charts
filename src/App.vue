<template>
  <summary-card v-for="county in summaryCountyData" :key="county" v-bind="county"/>
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
  mounted(){
    this.$store.dispatch('getData')
  }
}
</script>

<style>

</style>
