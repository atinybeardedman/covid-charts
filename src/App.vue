<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link class="toolbar-link" to="/">
          NYS COVID Trends
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon dark v-bind="attrs" v-on="on">
            <v-icon>mdi-chart-timeline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group :value="timeRangeMode">
            <v-list-item
              @click="selectTimeRange(index)"
              v-for="(option, index) in timeRangeOptions"
              :key="index"
              >{{ option }}</v-list-item
            >
          </v-list-item-group>
        </v-list>
      </v-menu> -->
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer">
      <side-nav
        @closeDrawer="$event === false ? (drawer = false) : null"
      ></side-nav>
      <template v-slot:append>
        <div class="caption text-center" v-if="updatedTimestamp">
          Data from: {{ new Date(updatedTimestamp).toLocaleString() }}
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SideNav from "./components/SideNav.vue";
export default {
  components: { SideNav },
  name: "App",
  data() {
    return {
      drawer: null,
      timeRangeOptions: ["Last 2 Weeks", "Since March 1st"],
    };
  },
  computed: {
    ...mapState(["timeRangeMode", "updatedTimestamp"]),
    ...mapGetters(["dates"]),
  },
};
</script>

<style>
a.toolbar-link {
  text-decoration: none;
  color: white !important;
}
</style>