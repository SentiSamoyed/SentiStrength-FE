<template>
  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
          <span>项目分值</span>
        </div>
      </div>
    </template>


    <el-form :model='form' label-width='200px'>
      <el-form-item label='版本'>
        <el-select
          v-model='this.form.selectedTags'
          multiple
          filterable
          clearable
          placeholder='请选择版本'
          @change='getRepoScore'
        >
          <template #prefix>
            <font-awesome-icon icon='fa-solid fa-code-compare' />
          </template>
          <el-option
            v-for='item in this.versions'
            :key='item.value'
            :label='item.label'
            :value='item.value'
          >
            <span style='float: left'>{{ item.label }}</span>
            <span
              style='
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 13px;
        '
            >{{ item.time }}</span
            >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>


    <div>
      <span>平均分值：{{ this.repoTotal.avg }}</span><br />
      <span>分值总和：{{ this.repoTotal.sum }}</span><br />
      <span>总条目数：{{ this.repoTotal.count }}</span><br />
      <span>分值平均值：{{ this.repoTotal.avg }}</span><br />
      <span>正向分值总数：{{ this.repoTotal.posCnt }}</span><br />
      <span>正向分值占比：{{ this.repoTotal.posRatio }}</span><br />
      <span>负向分值总数：{{ this.repoTotal.negCnt }}</span><br />
      <span>负向分值占比：{{ this.repoTotal.negRatio }}</span><br />
    </div>

    <div id='pie-container' />

  </el-card>

</template>

<script>
import apis from '@/apis'
import { Pie } from '@antv/g2plot'

export default {
  name: 'RepoScore',
  data() {
    return {
      currRepo: {
        owner: '',
        name: ''
      },
      form: {
        selectedTags: []
      },
      releases: [],
      versions: [],
      repoTotal: {
        sum: 0,
        count: 0,
        avg: 0,
        posCnt: 0,
        posRatio: 0,
        negCnt: 0,
        negRatio: 0
      },
      pieChart: {},
      pieDataCnt: 0,
      plot: null
    }
  },
  mounted() {
    this.currRepo = this.$parent.$data.repo

    apis.getRepoReleases(this.currRepo.owner, this.currRepo.name).then(res => {
      let releases = res.data.data

      this.$log.debug('getRepoReleases: ', releases)
      this.releases = releases
      releases.reverse()
      releases.forEach(release => {
        this.versions.push({
          label: release.tagName,
          value: release.tagName,
          time: new Date(release.createdAt).toDateString()
        })
      })
      //   加入 No release Tag 到版本列表最后面
      this.versions.push({
        label: 'No release Tag',
        value: 'No release Tag',
        time: 'Repo Created Date'
      })
    }).catch(err => {
      this.$message.error('获取仓库版本异常: ' + err)
    })

  },
  methods: {
    getRepoScore() {
      let releaseTags = this.form.selectedTags
      apis.getRepoTotal(this.currRepo.owner, this.currRepo.name, releaseTags).then(res => {
        let data = res.data.data
        Object.keys(this.repoTotal).forEach(key => {
          this.repoTotal[key] = data[key]
        })
        this.$log.debug('getRepoScore() repoTotal: ', this.repoTotal)
        this.$message.success('请求成功')
      }).catch(err => {
        this.$message.error('请求失败: ' + err)
      })
      this.updatePieData()
    },
    async updatePieData() {
      let tags = this.form.selectedTags
      this.$log.debug('first tag: ', tags[0])
      this.$log.debug('last tag: ', tags[tags.length - 1])
      let from = 0, to = 0
      for (const release in this.releases) {
        if (this.releases[release].tagName === tags[0]) {
          to = this.releases[release].createdAt
        }
        if (this.releases[release].tagName === tags[tags.length - 1]) {
          from = this.releases[release].createdAt
        }
      }
      this.$log.debug('timestamp from: ', from)
      this.$log.debug('timestamp to: ', to)
      await apis.getRepoPieChart(this.currRepo.owner, this.currRepo.name, from, to).then(res => {
        this.$log.debug('getRepoPieChart: ', res.data.data)
        this.pieChart = res.data.data
        // pie data cnt
        this.pieDataCnt = 0
        Object.keys(this.pieChart).forEach(key => {
          this.pieDataCnt += this.pieChart[key]
        })

      }).catch(err => {
        this.$message.error('获取饼图异常: ' + err)
        this.$log.error('获取饼图异常: ' + err)
      })

      await this.updatePieGraph()
    },
    async updatePieGraph() {
      let data = []
      // 将对象转换为数组
      Object.keys(this.pieChart).forEach(key => {
        data.push({
          type: key,
          value: this.pieChart[key]
        })
      })
      this.$log.debug('pieChart data: ', data)

      if (this.plot !== null) {
        // plot 已经初始化
        this.plot.changeData(data)
      } else {
        // 初始化 plot
        this.plot = new Pie(document.getElementById('pie-container'), {
          data,
          radius: 0.8,
          angleField: 'value',
          colorField: 'type',
          title: {
            visible: true,
            text: '仓库分值饼图',
            style: {
              fontSize: 14
            }
          },
          description: {
            visible: true,
            text: '仓库分值饼图',
            style: {
              fontSize: 14
            }
          },
          label: {
            type: 'spider',
            content: '{name}分： {percentage}'
          },
          meta: {
            type: {
              alias: '分值',
              formatter: (v) => `${v} 分`
            },
            value: {
              alias: '数量',
              formatter: (v) => `${v}`
            }
          },
          tooltip: {},
          interactions: [{ type: 'element-active' }],
          innerRadius: 0.4,
          statistic: {
            title: {
              offsetY: -10,
              style: { fontSize: '14px' },
              formatter: () => '总数量'
            },
            content: {
              offsetY: 10,
              style: { fontSize: '20px' },
              formatter: () => `${this.pieDataCnt} 个`
            }
          }
        })
        this.plot.render()
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
