<template>
  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
          <span>趋势图</span>
        </div>
        <el-button type='primary' @click='reset()'>重置</el-button>
      </div>
    </template>

    <el-form :model='form' label-width='200px'>
      <el-form-item label='时间粒度'>
        <el-select
          v-model='this.xAxis'
          filterable
          clearable
          placeholder='请选择时间粒度'
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

    <div id='container'/>

  </el-card>
</template>

<script>
import apis from '@/apis'
import { Line } from '@antv/g2plot'

export default {
  name: 'RepoGraph',
  mounted() {
    const data = [
      { year: '2012', value: 15 },
      { year: '2013', value: 20 },
      { year: '2014', value: -6 },
      { year: '2015', value: -10 },
      { year: '2016', value: 5 },
      { year: '2017', value: 15 },
      { year: '2018', value: 25 },
      { year: '2019', value: 30 },
      { year: '2020', value: 40 }
    ]
    const line = new Line('container', {
      data,
      xField: 'year',
      yField: 'value'
    })
    line.render()
  },
  data() {
    return {
      form: {},
      xAxisEnum: {
        'month': '月',
        'season': '季',
        'year': '年',
        'version': '版本'
      },
      yAxisEnum: {
        'ratio': '正负比例',
        'average': '平均分值',
        'sum': '分值总和'
      },
      xAxis: '',
      yAxis: '',
      graphList: []
    }
  },
  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.call(this))
      this.$message.success('已重置选项')
    },
    getRepoGraph() {
      apis.getRepoGraph(this.$parent.$data.repo, this.xAxis).then(res => {
        this.$message.success('获取成功')
      }).catch(err => {
        this.$message.error('获取失败: ' + err)
      })
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
