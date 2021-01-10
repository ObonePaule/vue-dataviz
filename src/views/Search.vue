<style lang="css">
.loader-container {
  padding: 175px 0;
}
.search-description-prefix {
  color: #fff;
}
.search-container {
  padding: 100px 25px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(../assets/images/search.jpg);
  background-size: cover;
  background-position: center;
}
</style>

<template>
  <div class="search-container">
    <p class="search-description-prefix">
      Trains annulés/en retard au départ ou à destination de:
      <em><b>{{ q }}</b></em>
    </p>

    <div class="search-results-container">
      <v-data-table
        v-if="showDatatable"
        :headers="headers"
        :items="trainRegularities"
        :items-per-page="5"
        no-data-text="Pas de resultat avec ce terme de recherche"
        class="elevation-2"
      ></v-data-table>
      <center v-else class="loader-container">
        <v-progress-circular
          :size="70"
          :width="7"
          color="white"
          indeterminate
        ></v-progress-circular>
      </center>
    </div>
  </div>
</template>

<script>
import { getTrainRegularityByStation } from "./../api";

export default {
  watch: {
    $route() {
      this.q = this.$route.query.q;
      this.refreshSearchResults();
    },
  },
  components: {},
  methods: {
    async refreshSearchResults() {
      this.showDatatable = false;
      this.trainRegularities = await getTrainRegularityByStation(this.q);
      this.showDatatable = true;
    },
  },
  data() {
    return {
      showDatatable: false,
      q: "",
      headers: [
        {
          text: "Gare de départ",
          align: "start",
          sortable: false,
          value: "startStation",
        },

        {
          text: "Gare d'arrivée",
          align: "start",
          sortable: false,
          value: "stopStation",
        },
        {
          text: "Période",
          align: "start",
          sortable: false,
          value: "period",
        },
        {
          text: "Nombre de trains annulés",
          align: "end",
          sortable: false,
          value: "canceledTrainsCount",
        },
        {
          text: "Nombre de trains en retard",
          align: "end",
          sortable: false,
          value: "lateTrainsCount",
        },
        {
          text: "Retard moyen au depart",
          align: "end",
          sortable: false,
          value: "averageDelayAtDeparture",
        },
        {
          text: "Retard moyen à l'arrivée",
          align: "end",
          sortable: false,
          value: "averageDelayAtArrival",
        },
        {
          text: "Durée moyenne du trajet",
          align: "end",
          sortable: false,
          value: "averageTripDuration",
        },
      ],
      trainRegularities: [],
    };
  },
  async mounted() {
    this.q = this.$route.query.q;
    this.refreshSearchResults();
  },
};
</script>
