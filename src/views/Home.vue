<style lang="css">
.leaflet-popup-content-wrapper {
  border-radius: 5px !important;
}
.station-name {
  font-weight: bold;
  font-size: 18px;
  color: black;
  font-family: serif;
}
.station-details {
  font-weight: 100;
  font-size: 16px;
  color: black;
  font-family: serif;
}
.station-details-btn,
.station-details-btn:hover,
.station-details-btn:active,
.station-details-btn:focus {
  text-decoration: none;
  color: black;
}
.station-details-btn {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  margin-top: 15px;
  background-color: aquamarine;
}
.home {
  width: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
}
.map-container {
  flex: 1;
}
.home,
.map-container,
.station-details-container {
  height: 100vh;
  margin: 0;
  padding: 0;
}
.station-details-container {
  width: 0px;
  opacity: 0;
  visibility: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: white;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.45) inset;
  z-index: 999;
  transition: all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
}
.open-station-details .station-details-container {
  width: 450px;
  opacity: 1;
  visibility: visible;
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.1s;
}
.pane {
  padding: 20px;
}
.pane-header {
  position: relative;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.selectedstation-name {
  font-size: 24px;
  font-weight: bolder;
  line-height: 24px;
}
.selectedstation-details {
  font-size: 16px;
  font-weight: 400;
}
.close-selectedstation-pane {
  position: absolute;
  right: 0;
  top: 0;
  color: #000;
  text-decoration: none;
  font-weight: bold;
}
.pane-section {
  margin-bottom: 50px;
}
.pane-section-header {
  font-size: 18px;
}
.pane-body {
  padding: 0;
}
</style>

<template>
  <div class="home">
    <div class="station-details-container">
      <div v-if="selectedStation" class="pane">
        <div class="pane-header">
          <h3 class="selectedstation-name">{{ selectedStation.name }}</h3>
          <h5 class="selectedstation-details">
            {{ selectedStation.cityName }}, {{ selectedStation.postalCode }}
            {{ selectedStation.deptName }}
          </h5>
          <router-link class="close-selectedstation-pane" to="/"
            >Fermer</router-link
          >
        </div>

        <div class="pane-body">
          <div class="pane-section">
            <h3 class="pane-section-header">Fréquentation de voyageurs</h3>
            <D3BarChart
              v-if="showSelectedStationFrequentations"
              :datum="selectedStation.frequentations"
              :config="chartConfig"
            ></D3BarChart>
          </div>

          <div class="pane-section">
            <h3 class="pane-section-header">Trains annulés/en retard</h3>
            <D3BarChart
              v-if="showSelectedStationFrequentations"
              :datum="selectedStation.frequentations"
              :config="chartConfig"
            ></D3BarChart>
          </div>
        </div>
      </div>
    </div>

    <div class="map-container">
      <l-map
        style="height: 100%; width: 100%"
        :zoom="zoom"
        :center="center"
        @update:zoom="zoomUpdated"
        @update:center="centerUpdated"
        @update:bounds="boundsUpdated"
      >
        <l-marker
          v-for="station in stations"
          :key="station.codeUIC"
          :lat-lng="station.latlng"
        >
          <l-icon
            :icon-size="iconSize"
            :icon-anchor="iconAnchor"
            :icon-url="
              selectedStation && selectedStation.codeUIC === station.codeUIC
                ? selectedIconImageUrl
                : defaultIconImageUrl
            "
          />
          <l-popup :content="station.popupContent" />
        </l-marker>
        <l-tile-layer :url="url"></l-tile-layer>
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon, LPopup } from "vue2-leaflet";
import { D3BarChart } from "vue-d3-charts";
import { getStations, getStationFrequentations } from "../api";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPopup,
    D3BarChart,
  },
  data() {
    return {
      showSelectedStationFrequentations: false,
      stations: [],
      selectedStation: null,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 7,
      center: [48.872829842, 2.321332048],
      bounds: null,
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      defaultIconImageUrl: "https://static.thenounproject.com/png/8262-200.png",
      selectedIconImageUrl:
        "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
      chartConfig: {
        key: "year",
        values: ["Voyageurs"],
        transition: { duration: 600, ease: "easeCubic" },
      },
    };
  },
  watch: {
    async $route() {
      await this.refreshStationDetails();
    },
  },
  methods: {
    async refreshStationDetails() {
      const route = this.$route;
      this.showSelectedStationFrequentations = false;

      const body = document.documentElement.querySelector("body");
      if (route.hash.toString().includes("#details?id=")) {
        const stationUICCode = route.hash.split("?id=")[1];

        this.selectedStation = this.stations.filter(
          (station) => station.codeUIC === stationUICCode
        )[0];

        body.classList.add("open-station-details");

        const frequentation = await getStationFrequentations(
          this.selectedStation.codeUIC
        );
        this.selectedStation.frequentations = frequentation.values;

        setTimeout(() => {
          this.showSelectedStationFrequentations = true;
          this.$forceUpdate();
        }, 500);
      } else {
        body.classList.remove("open-station-details");

        this.selectedStation = null;
      }
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
  },
  async mounted() {
    this.stations = await getStations();
    await this.refreshStationDetails();
  },
};
</script>
