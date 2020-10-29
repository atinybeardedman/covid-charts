import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import { getAllData } from "../api/data";
import { getGroupedCountyData, sortByDate, sliceData } from "../helpers/dataProcessing";
import { counties, colors } from "../constants/constants";

export default new Vuex.Store({
  state: {
    data: [],
    counties: ["Region", ...counties],
    loading: false,
    colors: colors,
    selectedCounty: "Region",
    countyData: {},
    updatedTimestamp: "",
    timeRangeMode: 0, // 0 is 14 days, 1 is all time
  },
  getters: {
    currentCountyData: (state) => {
      const countyData = state.countyData;
      const counties = state.counties;
      if (state.timeRangeMode === 1) {
        return countyData;
      } else {
        const recentCounty = {};
        if (JSON.stringify(countyData) === "{}") {
          return {};
        }
        for (const countyName of counties) {
          const county = countyData[countyName];
          const result = { ...sliceData(county, 14)};
          recentCounty[countyName] = { ...result };
        }
        return recentCounty;
      }
    },
    dates: (state) => {
      const allDates = [...new Set(state.data.map((d) => d.test_date))].sort();
      if (state.timeRangeMode === 0) {
        return allDates.slice(allDates.length - 14);
      } else {
        return allDates;
      }
    },
    loading: (state) => state.loading,
    selectedCountyData: (state, getters) => {
      return getters.currentCountyData[state.selectedCounty];
    },
    selectedColor: (state) => {
      return colors[state.selectedCounty];
    },
  },
  mutations: {
    SET_DATA(state, data) {
      state.data = data.sort(sortByDate);
      state.countyData = getGroupedCountyData(state.data);
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_COUNTY(state, county) {
      state.selectedCounty = county;
    },
    SET_TIMESTAMP(state, data) {
      state.updatedTimestamp = data;
    },
    TOGGLE_TIMERANGE(state, index) {
      state.timeRangeMode = index;
    },
  },
  actions: {
    async getData({ commit }) {
      try {
        commit("SET_LOADING", true);
        let response = await getAllData();
        let lastModified = response.headers["last-modified"];
        const date = new Date(lastModified);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        if (diff > 16 * 3600 * 1000) {
          response = await getAllData(true);
          lastModified = response.headers["last-modified"];
        }
        commit("SET_DATA", response.data);
        commit("SET_TIMESTAMP", lastModified);
        commit("SET_LOADING", false);
      } catch (err) {
        console.log(err);
      }
    },
  },
  modules: {},
});
