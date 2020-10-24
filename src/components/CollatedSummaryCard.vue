<template>
  <v-card>
    <v-card-title>{{name}}</v-card-title>
    <v-card-text>
        <v-simple-table>
            <template v-slot:default>
               <tbody>
                   <tr v-for="(point, i) in dataSet" :key="i">
                       <td>{{point.description}}</td>
                       <td>{{point.value}}</td>
                       <td>
                           <TrendIcon :isIncr="point.isIncr" :lastValue="point.lastValue" />
                       </td>
                   </tr>
               </tbody>
            </template>
        </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
import TrendIcon from './TrendIcon';
export default {
  name: "CollatedSummaryCard",
  components: {
      TrendIcon
  },
  props: {
    name: String,
    dataSet: Array
  },
};
</script>

<style>
</style>