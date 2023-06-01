<template>
  <card>
    <template #icon-text>
      <font-awesome-icon icon='fa-solid fa-star-half-stroke' />
      <span>项目分值</span>
    </template>
    <template #body>
      <el-form :model='form'>
        <el-form-item label='版本' label-width='35%'>
          <el-select
            v-model='this.form.selectedTags'
            clearable
            collapse-tags
            collapse-tags-tooltip
            filterable
            multiple
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
      <div class='statistics'>
        <el-row justify='space-evenly'>
          <el-col :span='4'></el-col>
          <el-col :span='4'>
            <el-statistic :value='this.repoTotal.count' precision='0' title='总条目数' />
          </el-col>
          <el-col :span='4'>
            <el-statistic :value='this.repoTotal.avg' precision='2'>
              <template #title>
                <div style='display: inline-flex; align-items: center'>
                  平均分值
                </div>
              </template>
            </el-statistic>

          </el-col>
          <el-col :span='4'>
            <el-statistic :value='this.repoTotal.sum' precision='0' title='分值总和' />
          </el-col>
          <el-col :span='4'></el-col>
        </el-row>
        <el-row justify='space-evenly'>
          <el-col :span='4'>
            <el-statistic :value='this.repoTotal.posCnt' precision='0' title='正向分值总数' />
          </el-col>
          <el-col :span='4'>
            <el-statistic :value='this.repoTotal.posRatio * 100' precision='2' suffix='%' title='正向分值占比' />
          </el-col>
        </el-row>
        <el-row justify='space-evenly'>
          <el-col :span='4'>
            <el-statistic :value='this.repoTotal.negCnt' precision='0' title='负向分值总数' />
          </el-col>
          <el-col :span='4'>
            <el-statistic :value='this.repoTotal.negRatio * 100' precision='2' suffix='%' title='负向分值占比' />
          </el-col>
        </el-row>

      </div>
      <div id='pie-container' />
    </template>
  </card>
</template>

<script>
import apis from '@/apis'
import { Pie } from '@antv/g2plot'
import { InfoFilled } from '@element-plus/icons-vue'
import Card from '@/components/common/Card.vue'

export default {
  name: 'RepoScore',
  components: { Card, InfoFilled },
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
      if (releases.length !== 0) {
        releases.reverse()
        releases.forEach(release => {
          this.versions.push({
            label: release.tagName,
            value: release.tagName,
            time: new Date(release.createdAt).toDateString()
          })
        })
      }
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
          interactions: [{ type: 'element-active' }]
          // innerRadius: 0.4,
          // statistic: {
          //   title: {
          //     offsetY: -10,
          //     style: { fontSize: '14px' },
          //     formatter: () => '总数量'
          //   },
          //   content: {
          //     offsetY: 10,
          //     style: { fontSize: '20px' },
          //     formatter: () => `${this.pieDataCnt} 个`
          //   }
          // }
        })
        this.plot.render()
      }
    }
  }
}
</script>

<style scoped>
el-form-item {
    width: 200px;
}

span {
    flex: 1;
    min-width: 100px;
    text-align: center;
}

</style>
