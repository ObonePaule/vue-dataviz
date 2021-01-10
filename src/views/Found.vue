<style lang="css">
  .loader-container {
    padding: 175px 0;
  }
  .chart-self {
    padding: 50px 0;
    padding-top: 0;
  }
  .background {
    width: 100%;
    height: 120px;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-image: url(../assets/images/map.jpg);
    background-size: cover;
    background-position: 0 50%;
  }
</style>

<template>
  <div class="chart-container">
    <div class="background" />
    <div class="filters">
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
          <v-autocomplete
            v-model="selectedStationName"
            :items="stationNames"
            dense
            solo
            label="Station"
            auto-select-first
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col class="d-flex" cols="12" sm="3">
          <v-select
            v-model="selectedYear"
            :items="years"
            label="Année"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col class="d-flex" cols="12" sm="3">
          <v-select
            v-model="selectedMonth"
            :items="months"
            label="Mois"
            dense
            solo
          ></v-select>
        </v-col>
      </v-row>
    </div>
    <div class="chart-content">
      <center v-if="!showChart" class="loader-container">
        <v-progress-circular
          :size="70"
          :width="7"
          color="purple"
          indeterminate
        ></v-progress-circular>
      </center>
      <D3LineChart class="chart-self" v-else :config="chart_config" :datum="chart_data"></D3LineChart>
    </div>
  </div>
</template>
  <style>
.chart-container {
  padding: 100px 65px;
}
</style>

  <script>
import { getLostObjects } from "../api";
import { D3LineChart } from "vue-d3-charts";

const NO_STATION_SELECTED = "Toutes les stations";

export default {
  components: {
    D3LineChart,
  },
  watch: {
    async selectedMonth() {
      await this.refreshChart();
    },
    async selectedYear() {
      await this.refreshChart();
    },
    async selectedStationName() {
      await this.refreshChart();
    },
  },
  data() {
    return {
      stationNames: [],
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021].reverse(),
      months: [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ],
      selectedYear: 2021,
      selectedMonth: "Janvier",
      selectedStationName: NO_STATION_SELECTED,
      showChart: false,
      chart_data: [],
      chart_config: {
        date: { key: "when", inputFormat: "%d-%m-%Y", outputFormat: "%d-%b" },
        values: ["Trouvés", "Restitués"],
        color: { scheme: "schemeCategory10" },
        axis: {
          xTicks: 0,
        },
        curve: "curveCatmullRom",
      },
    };
  },
  methods: {
    monthToInt(monthLabel) {
      const months = {
        Janvier: "01",
        Février: "02",
        Mars: "03",
        Avril: "04",
        Mai: "05",
        Juin: "06",
        Juillet: "07",
        Août: "08",
        Septembre: "09",
        Octobre: "10",
        Novembre: "11",
        Décembre: "12",
      };

      return months[monthLabel];
    },
    async refreshChart() {
      this.showChart = false;

      const lostObjectsDict = await getLostObjects(
        this.selectedYear,
        this.monthToInt(this.selectedMonth)
      );

      this.chart_data = Object.keys(lostObjectsDict.byDate).map((date) => {
        let objectsByDate = lostObjectsDict.byDate[date];
        if (this.selectedStationName) {
          objectsByDate = lostObjectsDict.byDate[date].filter((object) => {
            if (this.selectedStationName === NO_STATION_SELECTED) {
              return true;
            } else {
              return object.stationName.includes(this.selectedStationName);
            }
          });
        }

        return {
          when: date,
          Trouvés: objectsByDate.length,
          Restitués: objectsByDate.filter(
            (objectFound) => objectFound.isReturned
          ).length,
        };
      });
      this.chart_config.axis = {
        xTicks: this.chart_data.length,
      };
      this.stationNames = [NO_STATION_SELECTED].concat(
        Object.keys(lostObjectsDict.byStationName)
      );

      this.showChart = true;
    },
  },
  async mounted() {
    this.refreshChart();
  },
};
</script>
