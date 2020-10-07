<template>
  <div class="case-graph">
   <h1 v-if="loading">Loading...</h1>
   <p v-else>{{countyData.all}}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CaseGraph',
  computed: {
    ...mapGetters(['countyData', 'loading'])
  },
  mounted: function(){
    this.$store.dispatch('getData')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
