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

    <div>
      <span>项目ID：{{ this.repoInfo.id }}</span>
      <span>项目名称：{{ this.repoInfo.fullName }}</span>
      <span>项目地址：{{ this.repoInfo.htmlUrl }}</span>
      <span>上次更新时间：{{ this.repoInfo.lastUpdate }}</span>
    </div>

    <el-form :model='form' label-width='200px'>
      <el-form-item label='版本'>
        <el-select
          v-model='this.form.selectedVersions'
          multiple
          filterable
          clearable
          placeholder='请选择版本'
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
      <span>平均分值：{{ repoScore }}</span>
      <span>分值总和：{{ repoScore }}</span>
    </div>
    <div class='button-container'>
      <el-button type='primary' @click='getRepoScore'>提交</el-button>
    </div>
  </el-card>

</template>

<script>
import apis from '@/apis'

export default {
  name: 'RepoScore',
  data() {
    return {
      currRepo: {
        owner: '',
        name: ''
      },
      form: {
        selectedVersions: []
      },
      repoInfo: {
        id: -1,
        owner: '',
        name: '',
        fullName: '',
        htmlUrl: '',
        lastUpdate: 0
      },
      versions: [],
      repoTotal: {
        sum: 0,
        count: 0,
        avg: 0,
        posCnt: 0,
        posRatio: 0,
        negCnt: 0,
        negRatio: 0
      }
    }
  },
  mounted() {
    this.currRepo = this.$parent.$data.repo
    apis.getRepoInfo(this.currRepo.owner, this.currRepo.name).then(res => {
      this.repoInfo = res.data.data
    }).catch(err => {
      this.$message.error('获取仓库信息异常: ' + err)
    })

    apis.getRepoReleases(this.currRepo.owner, this.currRepo.name).then(res => {
      let releases = res.data.data

      this.$log.debug(releases)
      releases.reverse()
      releases.forEach(release => {
        this.versions.push({
          label: release.tagName,
          value: release.tagName,
          time: new Date(release.createdAt).toDateString()
        })
      })
      //   加入 No release Tag 到版本列表最前面
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
      let releaseTags = this.form.selectedVersions
      apis.getRepoTotal(this.currRepo.owner, this.currRepo.name, releaseTags).then(res => {
        let data = res.data.data
        Object.keys(this.repoTotal).forEach(key => {
          this.repoTotal[key] = data[key]
        })
        this.$log.debug(this.repoTotal)
        this.$message.success('请求成功')
      }).catch(err => {
        this.$message.error('请求失败: ' + err)
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
