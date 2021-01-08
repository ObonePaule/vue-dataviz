<template>
  <div class="chart-container">
    <div class="selectorDate">
      <v-row align="center">
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
        <v-col class="d-flex" cols="12" sm="3">
          <v-btn icon @click="refreshChart">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <D3LineChart :config="chart_config" :datum="chart_data"></D3LineChart>
  </div>
</template>
<style>
.chart-container {
  padding: 100px;
}
</style>

<script>
import { getLostObjects } from "../api";
import { D3LineChart } from "vue-d3-charts";

export default {
  components: {
    D3LineChart,
  },
  data() {
    return {
      years: [2015, 2016, 2017, 2018, 2019, 2020],
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      selectedYear: 2020,
      selectedMonth: 5,
      showChart: false,
      chart_data: [],
      chart_config: {
        date: { key: "when", inputFormat: "%d-%m-%Y" },
        values: ["Trouvés", "Restitués"],
        color: { scheme: "schemeCategory10" },
      },
    };
  },
  methods: {
    async refreshChart() {
      this.showChart = false;

      const lostObjects = await getLostObjects(
        this.selectedYear,
        this.selectedMonth
      );

      this.chart_data = Object.keys(lostObjects).map((date) => {
        return {
          when: date,
          Trouvés: lostObjects[date].length,
          Restitués: lostObjects[date].filter(
            (objectFound) => objectFound.isReturned
          ).length,
        };
      });

      this.showChart = true;
    },
  },
  async mounted() {
    this.refreshChart();
  },
};
</script>
