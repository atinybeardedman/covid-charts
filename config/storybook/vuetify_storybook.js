import Vue from 'vue';
import Vuetify from 'vuetify'; // loads all components
import 'vuetify/dist/vuetify.min.css'; // all the css for components
import '@mdi/font/css/materialdesignicons.css';
import config from "../../src/plugins/vuetify";

Vue.use(Vuetify);

export default new Vuetify(config);