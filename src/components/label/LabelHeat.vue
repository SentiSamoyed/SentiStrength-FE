<template>
  <card>
    <template #icon-text>
      <span>热力图</span>
    </template>
    <template #body>
      <div id='heat-canvas'></div>
    </template>
  </card>
</template>

<script>

import Card from '@/components/common/Card.vue'
import { Scatter } from '@antv/g2plot'
import heatmap from '/static/json/heat_map.json'

export default {
  name: 'LabelHeat',
  components: { Card },
  data() {
    return {
      plot: null
    }
  },
  mounted() {
    let data = []
    heatmap.forEach((item) => {
      data.push({
        volume: parseInt(item.volume),
        sentiment: parseFloat(item.sentiment),
        size: parseFloat(item.size),
        aspect: item.aspect,
        version: item.version
      })
    })
    this.draw2(data)
  },
  methods: {
    draw2(data) {
      this.$log.debug('draw2 data: ', data)
      this.plot = new Scatter('heat-canvas', {
        data,
        height: 600,
        xField: 'volume',
        yField: 'sentiment',
        shape: 'circle',
        sizeField: 'size',
        colorField: 'version',
        color: ['#5b8ff9', '#62daab'],
        size: [2, 20],
        xAxis: {
          nice: true,
          title: {
            text: '频数'
          }
        },
        yAxis: {
          nice: true,
          min: -0.5,
          max: 3.5,
          tickInterval: 0.5,
          title: {
            text: '情感'
          }
        },
        label: {
          formatter: (item) => {
            return parseFloat(item.size).toFixed(1)
          }
        },
        tooltip: {
          showTitle: false,
          fields: ['volume', 'sentiment', 'aspect', 'version', 'size']
        }
      })
      this.plot.render()
    }
  }
}
</script>

<style scoped>

</style>
