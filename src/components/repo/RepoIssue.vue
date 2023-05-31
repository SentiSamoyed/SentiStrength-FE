<template>

  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
          <span>项目 Issues</span>
        </div>
      </div>
    </template>

    <el-form :model='form' label-width='200px'>
      <el-form-item label='排序方向'>

        <el-select
          v-model='this.form.direction'
          placeholder='请选择排序方向'
          @change='this.getRepoIssue()'
        >
          <el-option
            v-for='(label, value) in this.directionEnum'
            :key='value'
            :label='label'
            :value='value'
          >
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label='排序依据'>
        <el-select
          v-model='this.form.sortBy'
          placeholder='请选择排序依据'
          @change='this.getRepoIssue()'
        >
          <el-option
            v-for='(label, value) in this.sortByEnum'
            :key='value'
            :label='label'
            :value='value'
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label='Issue 状态'>
        <el-select
          v-model='this.form.state'
          placeholder='请选择 Issue 状态'
          @change='this.getRepoIssue()'
        >
          <el-option
            v-for='(label, value) in this.stateEnum'
            :key='value'
            :label='label'
            :value='value'
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-table v-loading='loading' :data='this.issueList' :table-layout='"auto"' height='600px'>
      <el-table-column type='expand'>
        <template #default='scope'>
          <el-descriptions>
            <el-descriptions-item :span='24' label='Body'>
            </el-descriptions-item>
          </el-descriptions>
          <span>
              {{ scope.row.body }}
              </span>
        </template>
      </el-table-column>
      <el-table-column label='Issue 编号' prop='issueNumber' width='100px'></el-table-column>

      <el-table-column label='链接' width='80'>
        <template #default='scope'>
          <!--          <el-link :underline='false' :href='scope.row.htmlUrl' target='_blank'>打开链接</el-link>-->
          <el-button size='small' type='success' @click='openUrl(scope.row.htmlUrl)'>
            打开
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label='标题' prop='title'></el-table-column>
      <el-table-column label='作者' prop='author' width='150px'></el-table-column>
      <el-table-column label='状态' prop='state' width='100px'></el-table-column>
      <el-table-column label='情感值' prop='scaleVal' width='100px'></el-table-column>
    </el-table>


    <el-pagination
      v-model:current-page.sync='this.form.page'
      :page-count='this.pageCount'
      :page-size='this.pageSize'
      layout='prev, pager, next, jumper'
      @update:current-page='this.getRepoIssue()'
    />

  </el-card>
</template>

<script>
import apis from '@/apis'

export default {
  name: 'RepoIssue',
  mounted() {
    this.currRepo = this.$parent.$data.repo
    this.getRepoIssue()
  },
  data() {
    return {
      currRepo: {
        owner: '',
        name: ''
      },
      form: {
        page: 1,
        direction: 'asc',
        sortBy: 'scaleVal',
        state: 'open'
      },
      directionEnum: {
        desc: '降序',
        asc: '升序'
      },
      sortByEnum: {
        issueNumber: 'Issue 编号',
        createdAt: '创建时间',
        scaleVal: '情感分值'
      },
      stateEnum: {
        'open': '开放',
        'closed': '关闭',
        'open,closed': '全部'
      },
      pageCount: 0,
      pageSize: 0,
      issueList: [],
      loading: false
    }
  },
  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.call(this))
      this.$message.success('已重置选项')
    },
    getRepoIssue() {
      this.loading = true
      apis.getRepoIssues(this.currRepo.owner, this.currRepo.name, this.form.page - 1, this.form.direction, this.form.sortBy, this.form.state)
        .then(res => {
          let data = res.data.data
          this.$log.debug('getRepoIssues(): ', data)
          this.issueList = data.contentList
          this.pageCount = data.pageCount
          this.pageSize = data.pageSize
          this.$log.debug('getRepoIssues() pageCount: ', this.pageCount)
          this.$log.debug('getRepoIssues() pageSize: ', this.pageSize)
        }).catch(err => {
        this.$log.error('getRepoIssues(): ', err)
      }).finally(() => {
        this.loading = false
      })
    },
    openUrl(url) {
      // 打开 Github 链接
      window.open(url)
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
    flex: 0;
}

.icon-text span {
    min-width: 100px;
    text-align: center;
}
</style>
