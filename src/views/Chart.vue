<template>
  <div class="chart-container">
    <!-- Selecteur d'années -->
    <select v-model="selectedYear">
      <option :value="year" v-for="year in years" :key="year">{{year}}</option>
    </select>
  
    <D3BarChart :config="chart_config" :datum="chart_data"></D3BarChart>
  </div>
</template>

<script>
import { D3BarChart } from 'vue-d3-charts';

export default {
  components: {
    D3BarChart,
  },
  data() {
    return {
        years: [2007, 2008, 2009, 2010, 2011, 2012],
        selectedYear: 2015,
        chart_data: [
        {'Trouvés': 12000, 'Restitués': 9613, year: 2020},
        {'Trouvés': 2479, 'Restitués': 6315, year: 2008},
        {'Trouvés': 3200, 'Restitués': 1241, year: 2009},
        {'Trouvés': 320, 'Restitués': 241, year: 2010},
        {'Trouvés': 2200, 'Restitués': 125, year: 2011},
        {'Trouvés': 200, 'Restitués': 121, year: 2012},
      ],
      chart_config: {
        key: 'year',
        values: ['Trouvés', 'Restitués'],
        axis: {
          yTicks: 2
        },
        color: {
          keys: {
            'Trouvés': '#F98B3B',
            'Restitués': '#008000',
          },
        },
      },
    };
  },
};
</script>
