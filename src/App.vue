<style lang="css">
.floating-header {
  position: absolute !important;
  z-index: 999 !important;
  background: transparent !important;
  right: 5px !important;
}
.nav-link {
  text-decoration: none;
  color: black;
  font-weight: bolder;
}
* {
  letter-spacing: -.75px;
}
</style>

<template>
  <v-app>
    <v-card class="pa-4 floating-header" flat>
      <v-toolbar dense floating class="elevation-2">
        <v-text-field
          hide-details
          prepend-icon="mdi-magnify"
          single-line
          v-model="q"
          @input="onSearchValueChange"
          @keydown.enter="onSearchSubmit"
        ></v-text-field>

        <v-btn text><router-link class="nav-link" to="/">Home</router-link></v-btn>
        <v-btn text><router-link class="nav-link" to="/found">Objects found</router-link></v-btn>
        <v-btn text><router-link class="nav-link" to="/data">Data</router-link></v-btn>
      </v-toolbar>
    </v-card>
    <router-view />
  </v-app>
</template>

<script>
export default {
  watch: {
    $route() {
      this.q = this.$route.query.q
    },
  },
  components: {},
  data() {
    return {
      q: ""
    }
  },
  methods: {
    onSearchValueChange() {},
    onSearchSubmit() {
      this.$router.push({path: `/search?q=${this.q}`})
    },
  },
  async mounted () {}
}
</script>
