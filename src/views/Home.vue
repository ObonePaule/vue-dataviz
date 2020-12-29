<template>
  <div class="home">
    <div style="height: 100vh">
      <l-map
        style="height: 100%; width: 100%"
        :zoom="zoom"
        :center="center"
        @update:zoom="zoomUpdated"
        @update:center="centerUpdated"
        @update:bounds="boundsUpdated"
        >
        <l-marker v-for="station in stations" :key="station" :lat-lng="station.latlng">
          <l-icon
            :icon-size="iconSize"
            :icon-anchor="iconAnchor"
            icon-url="https://www.ija-lille.fr/wpress/wp-content/uploads/2018/01/map-marker-icon.png"
          />
          <l-popup :content="station.popupcontent"/>
        </l-marker>
        <l-tile-layer :url="url"></l-tile-layer>
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon, LPopup } from "vue2-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPopup
  },
  data() {
    return {
      stations: [
        {
          name:"aa",
          popupcontent:"Gare de saint lazare <br/><a href='google.com'>ah oui</a><a href='google.com'>ok</a>",
          latlng: [48.8926013, 2.2339234]
        },
        {
          name:"aa",
          popupcontent:"Gare de la defense<br/><a href='google.com'>ah oui</a><a href='google.com'>ok</a>",
          latlng: [48.872829842, 2.321332048]
        },
        {
          name:"aa",
          popupcontent:"Gare de Bercy <br/><a href='google.com'>ah oui</a><a href='google.com'>ok</a>",
          latlng: [48.8391474, 2.3805528]
        },
      ],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 15,
      center: [48.872829842, 2.321332048],
      bounds: null,
      iconSize: [32, 37],
      iconAnchor: [16, 37]
    };
  },
  methods: {
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
};
</script>
