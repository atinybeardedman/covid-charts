<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
    viewBox="0 0 633.475098 475.573242"
    @mouseleave="$emit('region-hover','')"
  >
    <g>
      <path fill="none" id="New_York_State" :d="outlinePath"></path>
    </g>
    <g>
        <router-link
          :to="getLink(region.region, 'Region')"
          v-for="region in regionList"
          :key="region.region"
          class="region"
        >
        <path :fill="region.color" :d="region.data" @mouseover="$emit('region-hover', region.region)"></path>
        </router-link>
    </g>
  </svg>
</template>

<script>
import { regionsSVG, stateOutline } from "../constants/countiesSVG";
import { regionDict, colors } from "../constants/constants";
export default {
  name: "NewYorkMap",
  methods: {
    getLink(region, county) {
      return `/${region}/${county}`;
    },
    getColor(regionName){
      const index = Object.keys(regionDict).indexOf(regionName);
      return colors[index];
    }
  },
  computed: {
    regionList() {
      return regionsSVG.map(r => ({...r, color: this.getColor(r.region)}))
    },
    outlinePath(){
      return stateOutline
    }
  },
};
</script>

<style>

path{
  stroke: black;
  stroke-width: 0.5;
}

.region {
  transition: opacity 0.2s;
}

.region:hover, .region.hovered {
  opacity: 0.75;
}
</style>