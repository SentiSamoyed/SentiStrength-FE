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
import { Heatmap } from '@antv/g2plot'
import heatmap from '/static/json/heat_map_220221.json'

export default {
  name: 'LabelHeat',
  components: { Card },
  data() {
    return {
      plot: null
    }
  },
  mounted() {
    let data = heatmap
    data.forEach((item) => {
      item.size = parseFloat(item.size) * 10
    })
    // 按照 sentiment 和 volume 排序
    data.sort((a, b) => {
      if (a.sentiment === b.sentiment) {
        return a.volume - b.volume
      } else {
        return a.sentiment - b.sentiment
      }
    })
    this.draw(data)
  },
  methods: {
    draw(data) {
      this.$log.debug(data)
      this.plot = new Heatmap(document.getElementById('heat-canvas'), {
        data,
        meta: {
          volume: {
            alias: '频数',
            nice: true,
            formatter: (text) => {
              return parseInt(text)
            }
          },
          sentiment: {
            alias: '情感',
            nice: true,
            formatter: (text) => {
              return parseFloat(text).toFixed(2)
            }
          },
          aspect: {
            alias: '方面',
            nice: true
          }
        },
        xField: 'volume',
        yField: 'sentiment',
        sizeField: 'size',
        colorField: 'aspect',
        shape: 'circle',
        label: {
          style: {
            fill: '#fff',
            stroke: '#fff',
            strokeOpacity: 0.5,
            lineWidth: 0.5,
            shadowColor: 'rgba(0, 0, 0, 0.45)',
            shadowBlur: 2
          },
          formatter: (text, item) => {
            return (parseFloat(text.size)).toFixed(0)
          }
        },
        tooltip: {
          showTitle: false,
          fields: ['aspect', 'volume', 'sentiment']
        },
        xAxis: {
          title: {
            text: '频数'
          }
        },
        yAxis: {
          title: {
            text: '情感'
          }
        }
      })
      this.plot.render()
    }
  }
}
</script>

<style scoped>

</style>
