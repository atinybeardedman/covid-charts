import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import { getData } from "../api/data";
import {
  getGroupedCountyData,
  sortByDate,
  sliceData,
} from "../helpers/dataProcessing";
import { colors, regionDict } from "../constants/constants";

export default new Vuex.Store({
  state: {
    data: [],
    regions: regionDict,
    // counties: ["Region", ...counties],
    loading: false,
    colors: colors,
    selectedCounty: "Region",
    selectedRegion: "",
    regionData: {},
    countyData: {},
    updatedTimestamp: "",
    timeRangeMode: 0, // 0 is 14 days, 1 is all time
    selectedIndex: 0,
    currentRegionData: {},
    selectedCountyData: {}
  },
  getters: {
    dates: (state) => {
      const allDates = [...new Set(state.data.map((d) => d.test_date))].sort();
        return allDates;
      
    },
    selectedColor: (state) => {
      return state.selectedCounty === 'Region' ? '#000' : state.colors[state.selectedIndex];
    },
  },
  mutations: {
    SET_DATA(state, payload) {
      state.data = payload.data.sort(sortByDate);
      state.regionData[payload.region] = getGroupedCountyData(
        state.data,
        payload.region
      );
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_COUNTY(state, county) {
      state.selectedCounty = county;
      state.selectedCountyData = state.currentRegionData[county]
      state.selectedIndex = regionDict[state.selectedRegion].indexOf(state.selectedCounty);
    },
    SET_REGION(state, region) {
      state.selectedRegion = region;
      const regionData = state.regionData;
      const counties = ["Region", ...state.regions[region]];
      if (state.timeRangeMode === 1) {
        state.currentRegionData = regionData[region];
      } else {
        const recentRegion = {};
        if (JSON.stringify(regionData[region]) === "{}") {
          state.currentRegionData = {};
        }
        for (const countyName of counties) {
          const county = regionData[region][countyName];
          const result = { ...sliceData(county, 14) };
          recentRegion[countyName] = { ...result };
        }
        state.currentRegionData  = recentRegion;
      }
    },
    SET_TIMESTAMP(state, data) {
      state.updatedTimestamp = data;
    },
    TOGGLE_TIMERANGE(state, index) {
      state.timeRangeMode = index;
    },
  },
  actions: {
    async getData({ commit, state }, region) {
      try {
        const counties = state.regions[region];
        let response = await getData(false, counties, state.timeRangeMode);
        let lastModified = response.headers["last-modified"];
        const date = new Date(lastModified);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        if (diff > 16 * 3600 * 1000) {
          response = await getData(true, counties, state.timeRangeMode);
          lastModified = response.headers["last-modified"];
        }
        commit("SET_DATA", { data: response.data, region });
        commit("SET_TIMESTAMP", lastModified);
      } catch (err) {
        console.log(err);
      }
    },
  },
  modules: {},
});
