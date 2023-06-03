<template>
  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon :icon="['fas', 'chart-line']" />
          <span>趋势图</span>
        </div>
      </div>
    </template>

    <el-form :model='form' label-width='200px'>
      <el-form-item label='时间粒度'>
        <el-select
          v-model='this.xAxis'
          filterable
          clearable
          placeholder='请选择时间粒度'
          @change='updateGraph'
        >
          <template #prefix>
            <font-awesome-icon icon='fa-solid fa-clock' />
          </template>
          <el-option
            v-for='(label, value) in this.xAxisEnum'
            :key='value'
            :label='label'
            :value='value'
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='纵坐标'>
        <el-select
          v-model='this.yAxis'
          filterable
          clearable
          placeholder='请选择纵坐标'
          @change='updateGraph'
        >
          <template #prefix>
            <font-awesome-icon icon='fa-solid fa-percent' />
          </template>
          <el-option
            v-for='(label, value) in this.yAxisEnum'
            :key='value'
            :label='label'
            :value='value'
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div id='tendency-container'>
    </div>

  </el-card>
</template>

<script>
import apis from '@/apis'
import { Line } from '@antv/g2plot'

export default {
  name: 'RepoGraph',
  async mounted() {
    this.currRepo = this.$parent.$data.repo
    await this.initTendencyGraph()
  },
  data() {
    return {
      currRepo: {
        owner: '',
        name: ''
      },
      form: {},
      xAxisEnum: {
        'month': '月',
        'quarter': '季',
        'year': '年',
        'release': '版本'
      },
      yAxisEnum: {
        'ratio': '正负比例',
        'avg': '平均分值',
        'sum': '分值总和'
      },
      ratioEnum: {
        'pos': '正分比例',
        'neg': '负分比例'
      },
      xAxis: 'month',
      yAxis: 'avg',
      graphList: {
        year: {},
        quarter: {},
        month: {},
        release: {}
      },
      plot: null
    }
  },
  methods: {
    async getRepoTendency() {
      for (const key of Object.keys(this.graphList)) {
        await apis.getRepoTendency(this.currRepo.owner, this.currRepo.name, key.toString()).then(res => {
          let data = res.data.data
          // 去除 data 中 avg 和 ratio 中的 NAN，avg替换为0，posRatio 和 negRatio 替换为0，否则会导致图表无法显示
          data.forEach(item => {
            item.avg = isNaN(item.avg) ? 0 : item.avg
            item.ratio = isNaN(item.ratio) ? 0 : item.ratio
            item.posRatio = isNaN(item.posRatio) ? 0 : item.posRatio
            item.negRatio = isNaN(item.negRatio) ? 0 : item.negRatio
          })
          this.graphList[key] = res.data.data
        }).catch(err => {
          this.$message.error('获取趋势图失败: ', err)
          this.$log.error(err)
        })
      }
      this.$log.debug('getRepoTendency() result graphList: ', this.graphList)
    },
    async initTendencyGraph() {
      await this.getRepoTendency()
      const line = new Line('tendency-container', {
        data: this.graphList[this.xAxis],
        xField: 'milestone',
        yField: this.yAxis,
        xAxis: {
          title: {
            text: this.xAxisEnum[this.xAxis]
          }
        },
        yAxis: {
          title: {
            text: this.yAxisEnum[this.yAxis]
          }
        },
        point: {},
        label: {
          // 如果是 avg ，保留两位；如果是 ratio ，加入百分号；如果是 sum ，直接显示整数
          // text 是data列表中的某个Object，item 是每个点的数据，index 是索引
          formatter: (text, item, index) => {
            if (this.yAxis === 'avg') {
              return text.avg.toFixed(2)
            } else if (this.yAxis === 'ratio') {
              return (text.ratio * 100).toFixed(2) + '%'
            } else if (this.yAxis === 'sum') {
              return text.sum
            }
          }
        },
        legend: {
          itemName: {
            formatter: (text) => {
              if (this.yAxis === 'ratio') {
                return this.ratioEnum[text]
              }
            }
          }
        },
        tooltip: {
          formatter: (item) => {
            if (this.yAxis === 'ratio') {
              return { name: this.ratioEnum[item.type], value: (item.ratio * 100).toFixed(2) + '%' }
            } else if (this.yAxis === 'sum') {
              return { name: '分值总和', value: item.sum }
            } else if (this.yAxis === 'avg') {
              return { name: '平均分值', value: item.avg.toFixed(2) }
            }

          }
        },
        slider: {
          start: 0,
          end: 1
        }
      })
      this.plot = line
      line.render()
    },
    updatePlot(data, xField, yField, seriesField) {
      this.$log.debug('updatePlot() data: ', data)
      this.$log.debug('updatePlot() xField: ', xField)
      this.$log.debug('updatePlot() xField: ', yField)
      this.plot.update({
        data: data,
        xField: xField,
        yField: yField,
        seriesField: seriesField,
        xAxis: {
          title: {
            text: this.xAxisEnum[this.xAxis]
          }
        },
        yAxis: {
          title: {
            text: this.yAxisEnum[this.yAxis]
          }
        }
      })
    },
    updateGraph() {
      if (this.yAxis === 'avg' || this.yAxis === 'sum') {
        this.updatePlot(this.graphList[this.xAxis], 'milestone', this.yAxis, '')
      } else if (this.yAxis === 'ratio') {
        let data = []
        this.graphList[this.xAxis].forEach(item => {
          data.push({
            milestone: item.milestone,
            ratio: item.posRatio,
            type: 'pos'
          })
          data.push({
            milestone: item.milestone,
            ratio: item.negRatio,
            type: 'neg'
          })
        })
        this.updatePlot(data, 'milestone', 'ratio', 'type')
      }
    }
  }
}
</script>

<style scoped>

.card {
    margin: 1rem 0;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

el-form-item {
    width: 200px;
}

.icon-text {
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-text span {
    flex: 1;
    min-width: 100px;
    text-align: center;
}
</style>
