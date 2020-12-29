<template>
  <v-app>
    <v-card class="pa-4 floating-header" flat>
      <v-toolbar dense floating>
        <v-text-field
          hide-details
          prepend-icon="mdi-magnify"
          single-line
        ></v-text-field>

        <v-btn text> Home </v-btn>
        <v-btn text> Objects found </v-btn>
        <v-btn text> Data </v-btn>
      </v-toolbar>
    </v-card>
    <router-view />
  </v-app>
</template>

<style lang="css">
.floating-header {
  position: absolute !important;
  z-index: 999 !important;
  background: transparent !important;
  left: 50px !important;
}
</style>
