
import { createStore } from 'vuex'
import { getAllData } from '../api/data'
import { getGroupedData } from '../helpers/dataProcessing';

export default createStore({
  state: {
    data: [],
    loading: false
  },
  getters: {
    recentData: state => {
      const d = new Date();
      d.setTime(d.getTime() - 14 * 24 * 3600 * 1000);
      const datestring = d.toISOString().substr(0, 10);
      return state.data.filter(d => d.test_date >= datestring);
    },
    countyPositives: (state, getters) => getGroupedData(getters.recentData),
    loading: state => state.loading
  },
  mutations: {
    SET_DATA(state, data){
      state.data = data;
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
