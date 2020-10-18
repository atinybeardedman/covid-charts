import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import { getAllData } from "../api/data";
import { getGroupedCountyData, sortByDate } from "../helpers/dataProcessing";
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
  },
  getters: {
    recentCountyData: (state) => {
      const countyData = state.countyData;
      const counties = state.counties;
      const recentCounty = {};
      if (JSON.stringify(countyData) === "{}") {
        return {};
      }
      for (const countyName of counties) {
        const county = countyData[countyName];
        const result = {};
        for (const prop of Object.keys(county)) {
          if (typeof county[prop] !== "string") {
            const list = county[prop];
            if (list.length > 14) {
              result[prop] = county[prop].slice(county[prop].length - 14);
            } else {
              result[prop] = county[prop].slice(0);
            }
          } else {
            result[prop] = county[prop];
          }
        }
        recentCounty[countyName] = { ...result };
      }
      return recentCounty;
    },
    // summaryCountyData: (state, getters) => {
    //   const countyData = getters.recentCountyData;
    //   if (JSON.stringify(countyData) === "{}") {
    //     return {};
    //   }
    //   const result = {};
    //   Object.keys(countyData).forEach((k) => {
    //     const obj = {
    //       name: k,
    //       newCases: [...countyData[k].newCases].pop(),
    //       totalTests: [...countyData[k].totalTests].pop(),
    //       percentPositive: [...countyData[k].percentPositive].pop(),
    //       rolling7Avg: [...countyData[k].rolling7Avg].pop(),
    //       rolling14Avg: [...countyData[k].rolling14Avg].pop(),
    //     };
    //     result[k] = { ...obj };
    //   });
    //   return result;
    // },
    dates: (state) => [...new Set(state.data.map((d) => d.test_date))].sort(),
    recentDates: (state, getters) =>
      getters.dates.slice(getters.dates.length - 14),
    loading: (state) => state.loading,
    selectedCountyData: (state) => {
      return state.countyData[state.selectedCounty];
    },
    selectedRecentCountyData: (state, getters) => {
      return getters.recentCountyData[state.selectedCounty];
    },
    // selectedCountySummary: (state, getters) => {
    //   return getters.summaryCountyData[state.selectedCounty];
    // },
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
  },
  actions: {
    async getData({ commit }) {
      try {
        commit("SET_LOADING", true);
        let response = await getAllData();
        const date = new Date(response.headers["last-modified"]);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        if (diff > 12 * 3600 * 1000) {
          response = await getAllData(true);
        }
        commit("SET_DATA", response.data);
        commit("SET_TIMESTAMP", response.headers["last-modified"]);
        commit("SET_LOADING", false);
      } catch (err) {
        console.log(err);
      }
    },
  },
  modules: {},
});
