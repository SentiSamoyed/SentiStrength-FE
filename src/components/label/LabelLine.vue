<template>
  <card>
    <template #icon-text>
      <span>折线图</span>
    </template>
    <template #body>
      <div id='line-canvas'></div>
    </template>
  </card>
</template>

<script>
import Card from '@/components/common/Card.vue'
import lineChart from '/static/json/linechart.json'
import { Line } from '@antv/g2plot'

export default {
  name: 'LabelLine',
  components: { Card },
  data() {
    return {
      plot: null
    }
  },
  mounted() {
    let data = lineChart
    let v1Data = []
    let v2Data = []
    data.forEach((item) => {
      if (item.version === 'rocketmq-all-4.9.3') {
        v1Data.push(item)
      }
    })
    data.forEach((item) => {
      if (item.version === 'rocketmq-all-4.9.4') {
        v2Data.push(item)
      }
    })
    v1Data = this.completeXField(v1Data)
    v2Data = this.completeXField(v2Data)
    // 合并两个版本的数据
    data = v1Data.concat(v2Data)
    this.draw(data)
  },
  methods: {
    completeXField(arr) {
      // 补全缺失的 xField 值
      // 找到最小的 xField 和最大的 xField
      let minXField = arr[0].xField
      let maxXField = arr[0].xField
      arr.forEach(item => {
        if (item.xField < minXField) {
          minXField = item.xField
        }
        if (item.xField > maxXField) {
          maxXField = item.xField
        }
      })
      let completeData = []
      for (let i = minXField; i <= maxXField; i++) {
        const existingData = arr.find(item => item.xField === i)
        if (existingData) {
          completeData.push(existingData)
        } else {
          const newData = {
            xField: i,
            yField: 0, // 或者设置为其他默认值
            aspect: 'no data', // 或者设置为其他默认值
            version: arr[0].version // 或者设置为其他默认值
          }
          completeData.push(newData)
        }
      }
      return completeData
    },
    draw(data) {
      this.$log.debug('line chart data: ', data)
      const line = new Line('line-canvas', {
        data: data,
        xField: 'xField',
        yField: 'yField',
        xAxis: {
          title: {
            text: '时间'
          }
        },
          yAxis: {
            title: {
              text: '评论数量'
            }
          },
          seriesField: 'version',
          point: {},
          label: {},
          tooltip: {
            fields: ['xField', 'yField', 'aspect']
          }
        }
      )
      this.plot = line
      line.render()

    }
  }
}
</script>

<style scoped>

</style>
