<template>
  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
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
          @change='updateXAxis'
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
          @change='updateYAxis'
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
      <el-empty v-if='noData' description='无数据'></el-empty>
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
        yField: this.yAxis
      })
      this.plot = line
      line.render()
    },
    updateYAxis() {
      if (this.yAxis === 'avg' || this.yAxis === 'sum') {
        this.plot.update({
          data: this.graphList[this.xAxis],
          xField: 'milestone',
          yField: this.yAxis
        })
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
        this.$log.debug('updateYAxis data: ', data)
        this.plot.update({
          data: data,
          xField: 'milestone',
          yField: 'ratio',
          seriesField: 'type'
        })
      }
    },
    updateXAxis() {
      this.plot.update(
        {
          data: this.graphList[this.xAxis],
          xField: 'milestone',
          yField: this.yAxis
        })
      this.updateYAxis()
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

.button-container {
    display: flex;
    justify-content: flex-end;
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
