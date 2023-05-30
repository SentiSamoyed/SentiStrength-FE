<template>
  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
          <span>初始化项目</span>
        </div>
        <div v-if='loading' class='icon-line'>
          <div class='icon'>
            <el-icon class='is-loading'>
              <Loading />
            </el-icon>
          </div>
          <div class='progress-line'>
            <el-progress :format='() => ``' :indeterminate='true' :percentage='50' />
          </div>
        </div>
      </div>
    </template>

    <el-form ref='form' :model='form' :rules='formRules'>
      <el-form-item label='项目名称' label-width='35%' prop='selectedRepoName'>
        <el-autocomplete
          v-model='form.selectedRepoName'
          :fetch-suggestions='querySearch'
          placeholder='请输入项目名称'
          clearable
        >
          <template #prefix>
            <font-awesome-icon icon='fa-solid fa-search' />
          </template>
        </el-autocomplete>

      </el-form-item>
    </el-form>


    <div class='button-container'>
      <el-button type='primary' @click='initRepo()'>下一步</el-button>
    </div>
  </el-card>
</template>

<script>

import apis from '@/apis'
import { Loading } from '@element-plus/icons-vue'

export default {
  name: 'RepoInit',
  components: { Loading },
  data() {
    return {
      form: {
        selectedRepoName: ''
      },
      formRules: {
        selectedRepoName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { pattern: /^[\w-]+\/[\w-]+$/, message: '请输入完整的项目名称，如：owner/repo' }
        ]
      },
      repo: {
        owner: '',
        name: ''
      },
      loading: false,    // 是否正在加载数据
      maxAttempts: 10,   // 最大轮询次数
      attemptCount: 0    // 当前轮询次数
    }
  },
  methods: {
    querySearch(queryString, cb) {
      let repoList = this.$parent.$data.repoList
      let repoNameList = repoList.map(item => {
        return {
          id: item.id,
          value: item.fullName
        }
      })
      this.$log.debug('current repo name list: ', repoNameList)
      let suggestions = repoNameList.filter(item => item.value.includes(queryString, 0))
      this.$log.debug('suggestions: ', suggestions)
      cb(suggestions)
    },
    // 设置 repo owner 和 repo name
    setRepo(repoFullName) {
      let [, owner, name] = repoFullName.match(/^([\w-]+)\/([\w-]+)$/)
      this.repo.owner = owner
      this.repo.name = name
    },
    // 设置父组件的 repo 信息
    setParentRepo() {
      this.$parent.$data.repo.name = this.repo.name
      this.$parent.$data.repo.owner = this.repo.owner
    },
    initRepo() {
      // 检查校验规则
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message.error('请检查输入项')
        }
      }).catch((err) => {
        this.$message.error('请检查输入项')
      }).finally(() => {
        this.$log.debug('校验完成')
      })

      let repoList = this.$parent.$data.repoList
      let initialized = repoList.some(item => item.fullName === this.form.selectedRepoName)
      // 设置当前选择的的 repo
      this.setRepo(this.form.selectedRepoName)

      // 已初始化
      if (initialized) {
        this.setParentRepo()
        this.$message.success('该项目已经初始化')
        return
      }

      // 未初始化
      this.$log.info('需要初始化的 repo 全名: ', this.form.selectedRepoName)
      this.$messageBox.confirm('初始化时间较长，建议稍候再来', '该项目未初始化', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$log.info('确认初始化项目：', this.form.selectedRepoName)
        // 初始化项目
        this.fetchData()
      }).catch(() => {
        this.$log.info('取消初始化项目：', this.form.selectedRepoName)
      })
    },
    fetchData() {
      this.$message.info(`项目 ${this.form.selectedRepoName} 初始化中，请稍候...`)
      this.loading = true    // 显示加载圈
      this.attemptCount = 0  // 重置轮询计数器
      this.pollData() // 开始轮询数据
    },
    async pollData() {
      try {
        while (true) {
          this.$log.debug('轮询次数: ', this.attemptCount)
          this.$log.debug('最大次数: ', this.maxAttempts)
          // 达到最大轮询次数，停止轮询
          if (this.attemptCount >= this.maxAttempts) {
            this.$log.error('超时')
            this.$message.warning('初始化时间过长，请等待一段时间后再试')
            this.loading = false
            return
          }
          const res = await apis.initRepo(this.repo.owner, this.repo.name)
          let data = res.data.data
          this.$log.debug('轮询结果：', data)

          if (data === 0) {
            // 未初始化完成，继续轮询
            this.$log.debug('data 为 0，继续轮询')
            await new Promise((resolve) => setTimeout(resolve, 2000))
            this.attemptCount++
            continue
          } else if (data === 1) {
            // 初始化完成，停止轮询
            this.$log.debug('data 为 1,轮询完成')
            this.setParentRepo()
            this.$message.success('初始化成功')
          } else if (data === 2) {
            // repo 不存在
            this.$log.debug('data 为 2, repo 不存在')
            this.$log.error('Repo 不存在')
            this.$message.error('该仓库不存在')
          } else if (data === 3) {
            // repo 不存在 issues
            this.$log.debug('data 为 3, repo 不存在 issues')
            this.$log.error('Repo 不存在 Issues')
            this.$message.error('该仓库不存在 Issues')
          }
          this.loading = false
          break
        }
      } catch (e) {
        this.$log.error('轮询异常: ', e)
        this.loading = false
        this.$message.error('请求异常')
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

.checkboxes {
    margin: 1rem;
}

.checkbox {
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

.progress-line {
    width: 20rem;
}

.icon {
    display: flex;
    margin-right: 0.5rem;
}

.icon-line {
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>
