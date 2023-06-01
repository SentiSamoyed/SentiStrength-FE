<template>
  <card>
    <template #icon-text>
      <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
      <span>项目 Issues</span>
    </template>
    <template #body>
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
        <el-table-column label='详细信息' type='expand' width='100'>
          <template #default='scope'>
            <el-descriptions column='2' style='padding: 0 3rem'>
              <el-descriptions-item label='创建时间'>{{ new Date(scope.row.createdAt).toDateString() }}
              </el-descriptions-item>
              <el-descriptions-item label='修改时间'>{{ new Date(scope.row.updatedAt).toDateString() }}
              </el-descriptions-item>
              <el-descriptions-item label='评论数量'>{{ scope.row.comments }}</el-descriptions-item>
              <el-descriptions-item :span='24' label='Body 内容'>
                <el-button size='small' type='primary' @click='toggleDialogVisibility(scope.row.body)'>
                  查看
                </el-button>
                <el-dialog
                  v-model='dialogVisible'
                  :modal=false
                  append-to-body
                  title='Body 内容'
                  width='80%'
                >
                  <span id='issue-body' v-html='issueBody'></span>
                </el-dialog>
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column label='Issue 编号' prop='issueNumber' width='100px'></el-table-column>

        <el-table-column label='链接' width='50'>
          <template #default='scope'>
            <el-button size='small' type='primary' @click='openUrl(scope.row.htmlUrl)'>
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
    </template>
  </card>
</template>

<script>
import apis from '@/apis'
import Card from '@/components/common/Card.vue'
import { marked } from 'marked'

export default {
  name: 'RepoIssue',
  components: { Card },
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
      loading: false,
      dialogVisible: false,
      issueBody: ''
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
    },
    toggleDialogVisibility(body) {
      this.dialogVisible = !this.dialogVisible
      this.issueBody = marked(body)
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

#issue-body {
    word-break: normal;
    width: auto;
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: scroll;

}
</style>
