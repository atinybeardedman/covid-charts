<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
    viewBox="0 0 633.475098 475.573242"
  >
    <g>
      <g v-for="region in regionList" :key="region.name" class="region">
        <router-link
          :to="getLink(region.name, county.name)"
          v-for="county in region.counties"
          :key="county.name"
          :fill="region.color"
        >
          <polygon
            v-if="county.tag === 'polygon'"
            :points="county.data"
          ></polygon>
          <path v-else :d="county.data"></path>
        </router-link>
      </g>
    </g>
  </svg>
</template>

<script>
import { countyPoints } from "../constants/countiesSVG";
import { regionDict, colors } from "../constants/constants";
export default {
  name: "NewYorkMap",
  methods: {
    getLink(region, county) {
      return `/${region}/${county}`;
    },
  },
  computed: {
    regionList() {
      return Object.keys(regionDict).map((r, regionIndex) => ({
        name: r,
        color: colors[regionIndex],
        counties: regionDict[r].map((c, countyIndex) => ({
          name: c,
          data: countyPoints[c].data,
          tag: countyPoints[c].tag,
          color: colors[countyIndex],
        })),
      }));
    },
  },
};
</script>

<style>
g,
path,
polygon {
  stroke: black;
  stroke-width: 0.25;
  transition: opacity 0.2s;
}

.region:hover {
  opacity: 0.75;
}
</style>