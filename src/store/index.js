
import { createStore } from 'vuex'
import { getAllData } from '../api/data'
import { getGroupedCountyData, sortByDate } from '../helpers/dataProcessing';

export default createStore({
  state: {
    data: [],
    loading: false
  },
  getters: {
    recentData: state => {
      const d = new Date();
      d.setTime(d.getTime() - 15 * 24 * 3600 * 1000);
      const datestring = d.toISOString().substr(0, 10);
      return state.data.filter(d => d.test_date >= datestring);
    },
    recentCountyData: (state, getters) => getGroupedCountyData(getters.recentData),
    summaryCountyData: (state, getters) => {
      const countyData = getters.recentCountyData;
      return Object.keys(countyData).map(k => ({
        name: k,
        newCases: countyData[k].newCases.pop(),
        totalTests: countyData[k].totalTests.pop(),
        percentPositive: countyData[k].percentPositive.pop(),
        rolling7Avg: countyData[k].rolling7Avg.pop(),
        rolling14Avg: countyData[k].rolling14Avg.pop(),
      }))
    },
    countyData: (state) => getGroupedCountyData(state.data),
    loading: state => state.loading
  },
  mutations: {
    SET_DATA(state, data){
      state.data = data.sort(sortByDate);
    },
    SET_LOADING(state, isLoading){
      state.loading = isLoading;
    }
  },
  actions: {
    async getData({commit}) {
      try {
        commit('SET_LOADING', true);
        const response = await getAllData();
        commit('SET_DATA', response.data);
        commit('SET_LOADING', false);
      } catch(err){
        console.log(err);
      }

    }
  },
  modules: {
  }
})
