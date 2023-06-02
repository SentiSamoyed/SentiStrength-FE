<template>
  <card>
    <template #icon-text>
      <span>热力图</span>
    </template>
    <template #body>
      <div id='heat-canvas'></div>
      <div id='write'>
        <h3 id='分析'><span>分析</span></h3>
        <ol start=''>
          <li>
            <span>情绪趋势：由热图中的球体分布，我们可以知道高词频的情绪值较高，而低频词的情绪值较低，可以推断在该数据集中，高词频比低词频的讨论往往更激烈。</span>
          </li>
          <li>
            <span>高频词分析：在热图的高频词中，</span><code>broker</code><span>、</span><code>consumer</code><span>、</span><code>topic</code><span>等词更与积极情绪相关，这些词是具有普遍关注度或重要性的词汇，在
            apache/rocketmq 项目情绪表达中起到重要作用。RocketMQ 是一款开源的分布式消息队列系统，consumer 是消息队列中的消息接收方，它从 broker
            订阅或消费消息，并对消息进行处理，broker 是消息队列的中间层，负责存储和转发消息。由此可见，consumer 和 broker 是 RocketMQ 的重要组件，被开发者广泛而热烈地讨论。</span>
          </li>
          <li><span>低频词分析：低频词中，</span><code>storetime</code><span>、</span><code>block</code><span>等词的情绪更强烈，说明这些 aspect
            更可能与积极或消极情绪相关，它们是一些特定领域或语境下出现的词汇，通过热图分析我们发现了这些在情绪表达中较为罕见但有一定情绪色彩的词汇。在 RocketMQ
            中，</span><code>storetime</code><span>是指消息在 broker
            中存储的时间戳，它表示消息被持久化到存储系统的时间。每条消息在被存储时都会附带一个存储时间，用于记录消息的持久化时间点。从热图可以看出，RocketMQ 中与时间戳有关的问题多为负面。</span>
          </li>
          <li><span>低频高情绪值分析：低频词中，情绪最为强烈的评论为一条开发者对 issue 提出者的回复，对其提出的 bug 的工作给予肯定，同时指出将采用新的 Client
            来解决问题，这种项目管理者与其他社区人员的友好氛围体现了开源的优越性。</span></li>
        </ol>
      </div>
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
@import "@/assets/home.css";
</style>
