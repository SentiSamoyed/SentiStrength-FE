<template>
  <card>
    <template #icon-text>
      <font-awesome-icon icon='fa-solid fa-star-half-stroke' />
      <span>项目分值</span>
    </template>
    <template #header>
      <el-button
        type='primary'
        @click='selectAllTags'>
        全选
      </el-button>
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
      tagTimeMap: {},
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
      // 加入 release 开头
      releases.unshift({
        tagName: 'No release',
        createdAt: 0
      })
      this.$log.debug('getRepoReleases: ', releases)
      this.releases = releases

      // 生成 tag -> time 的 map
      releases.forEach(release => {
        this.tagTimeMap[release.tagName] = release.createdAt
      })

      if (releases.length !== 0) {
        releases.reverse()
        // 展示 versions 选择框
        releases.forEach(release => {
          this.versions.push({
            label: release.tagName,
            value: release.tagName,
            time: new Date(release.createdAt).toLocaleDateString()
          })
        })
      }
      this.selectAllTags()
    }).catch(err => {
      this.$message.error('获取仓库版本异常: ' + err)
    })
  },
  methods: {
    selectAllTags() {
      // 默认选择所有tag
      this.form.selectedTags = []
      this.versions.forEach(version => {
        this.form.selectedTags.push(version.value)
      })
      this.getRepoScore()
    },
    getRepoScore() {
      let selectedTags = this.form.selectedTags
      // 对 release tags 进行排序
      selectedTags.sort((a, b) => {
        return this.tagTimeMap[a] - this.tagTimeMap[b]
      })
      apis.getRepoTotal(this.currRepo.owner, this.currRepo.name, selectedTags).then(res => {
        let data = res.data.data
        Object.keys(this.repoTotal).forEach(key => {
          this.repoTotal[key] = data[key] === 'NaN' ? 0 : data[key]
        })
        this.$log.debug('getRepoScore() repoTotal: ', this.repoTotal)
      }).catch(err => {
        this.$message.error('请求失败: ' + err)
      })
      this.updatePieData(selectedTags)
    },
    getFromTo(tags) {
      if (tags.length === 1 && tags[0] === 'No release') {
        return [0, new Date().getTime()]
      }
      let from = 0, to = 0
      let fromTag = '', toTag = ''
      if (tags.length > 1) {
        fromTag = tags[0]
        toTag = tags[tags.length - 1]
        from = this.tagTimeMap[fromTag]
        let toTagIndex = this.releases.findIndex(release => release.tagName === toTag)
        // 如果是最后一个 tag, 则 to 为当前时间，否则为下一个 tag 的时间
        toTagIndex = toTagIndex < 1 ? toTagIndex : toTagIndex - 1
        to = this.tagTimeMap[this.releases[toTagIndex].tagName]
      } else if (tags.length === 1) {
        fromTag = tags[0]
        toTag = 'Now'
        from = this.tagTimeMap[fromTag]
        to = new Date().getTime()
      }
      console.log('tag from: ', fromTag, new Date(from).toLocaleDateString())
      console.log('tag to: ', toTag, new Date(to).toLocaleDateString())
      return [from, to]
    },
    async updatePieData(tags) {
      let fromTo = this.getFromTo(tags)
      let from = fromTo[0]
      let to = fromTo[1]

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
