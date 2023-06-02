<template>
  <card>
    <template #icon-text>
      <span>折线图</span>
    </template>
    <template #body>
      <div id='line-canvas'></div>
      <div id='write'>
        <h3 id='分析'><span>分析</span></h3>
        <ol start=''>
          <li>
            <p><span>评论数量趋势：</span></p>
            <ol start=''>
              <li><span>两个版本的评论在项目最初都较少，从第四天开始，评论数量增加。</span></li>
              <li><span>相比 rocketmq-all-4.9.4 版本，rocketmq-all-4.9.3 版本在开发过程中评论数量波动的比较小。值得注意的是，rocketmq-all-4.9.4 版本在第 11
                天附近评论数量激增，讨论较多。可能是该版本出现了比较严重的问题，或者推出了具有争议性的新特性。</span></li>
              <li><span>总体来看，两个版本的评论数量随时间呈现小幅度波动状态，每天的评论数量基本在 10 条以内。</span></li>
            </ol>
          </li>
          <li>
            <p><span>假设和解释：</span></p>
            <ol start=''>
              <li><span>基于以上对折线图的观察和分析，comment
                之所以呈现这种趋势，可能是由于在新版本刚开始的时候，出于对项目的不熟悉，以及进展较慢，对项目的讨论热度不高。很快随着项目的深入开展，逐渐形成了稳定的讨论状态。</span>
              </li>
              <li>
                <span>在 comment 到达峰值之后，之后几天的数值往往会低于峰值之前的平均值，可能是由于峰值讨论的问题或特性需要时间进行理解或检验。</span>
              </li>
              <li><span>comment 达到峰值时，aspect 为 synchronized 这一 Java 关键字，这跟 RocketMQ
                为一款低延迟，高并发，高可用的分布式中间件这一项目特性有明显关系，其同步能力的强弱决定了产品的好坏。</span>
              </li>
            </ol>
          </li>
        </ol>
      </div>
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
