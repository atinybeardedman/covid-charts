
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { getAllData } from '../api/data'
import { getGroupedCountyData, sortByDate } from '../helpers/dataProcessing';
import { counties } from '../constants/constants';

export default new Vuex.Store({
  state: {
    data: [],
    counties: ['Region', ...counties],
    loading: false
  },
  getters: {
    // recentData: state => {
    //   const d = new Date();
    //   d.setTime(d.getTime() - 15 * 24 * 3600 * 1000);
    //   const datestring = d.toISOString().substr(0, 10);
    //   return state.data.filter(d => d.test_date >= datestring);
    // },
    recentCountyData: (state, getters) => {
      const countyData = getters.countyData;
      const counties = state.counties;
      const recentCounty = {};
      if(JSON.stringify(countyData) === '{}'){
        return {}
      }
      for(const countyName of counties){
        const county = countyData[countyName];
        const result = {};
        for(const prop of Object.keys(county)){
          if(typeof prop !== 'string'){
            const list = county[prop];
            if(list.length > 14){
              result[prop] = county[prop].slice(county[prop].length - 14);
            } else {
              result[prop] = county[prop].slice(0);
            }
          } else {
            result[prop] = county[prop];
          }
    
        }
        recentCounty[countyName] = {...result};
      }
      return recentCounty
    },
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
