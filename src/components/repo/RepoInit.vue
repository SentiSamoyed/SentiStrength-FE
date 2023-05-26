<template>
  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
          <span>初始化项目</span>
        </div>
      </div>
    </template>

    <el-form :model='form' ref='form' :rules='formRules' label-width='200px'>
      <el-form-item label='项目名称' prop='selectedRepoName'>
        <el-autocomplete
          v-model='form.selectedRepoName'
          :fetch-suggestions='querySearch'
          placeholder='请输入项目名称'
          @select='handleSelect'
          @change='handleChange'
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

export default {
  name: 'RepoInit',
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
      maxAttempts: 15,   // 最大轮询次数
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
      this.$log.debug('current repo name list: ' + repoNameList)
      let suggestions = repoNameList.filter(item => item.value.includes(queryString, 0))
      this.$log.debug('suggestions: ' + suggestions)
      cb(suggestions)
    }
    ,
    handleSelect(item) {
      this.$log.info('selected repo path: ' + this.form.selectedRepoName)
    }
    ,
    handleChange(item) {
      this.$log.info('input repo path: ' + this.form.selectedRepoName)
    },
    // 设置 repo owner 和 repo name
    setRepo(repoFullName) {
      let [, owner, name] = repoFullName.match(/^([\w-]+)\/([\w-]+)$/)
      this.repo.owner = owner
      this.repo.name = name
    },
    // 设置父组件的 repo 信息
    setParentRepo() {
      this.$parent.$data.repo = this.repo
    },
    initRepo() {
      // 检查校验规则
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message.error('请检查输入项')
          return
        }
      })

      let repoList = this.$parent.$data.repoList
      let initialized = repoList.some(item => item.fullName === this.form.selectedRepoName)

      this.setRepo(this.form.selectedRepoName)

      // 已初始化
      if (initialized) {
        this.setParentRepo()
        this.$message.success('该项目已经初始化')
        return
      }

      // 未初始化
      this.$log.info('需要初始化的 repo fullname: ' + this.form.selectedRepoName)
      this.$messageBox.confirm('确认初始化该项目？', '未初始化项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$log.info('确认初始化项目：' + this.form.selectedRepoName)
        // 初始化项目
        this.fetchData()
      }).catch(() => {
        this.$log.info('取消初始化项目：' + this.form.selectedRepoName)
      })
    }
    ,
    fetchData() {
      this.loading = true    // 显示加载圈
      this.attemptCount = 0  // 重置轮询计数器
      this.pollData() // 开始轮询数据
    },
    async pollData() {
      try {
        // 达到最大轮询次数，停止轮询
        if (this.attemptCount >= this.maxAttempts) {
          this.$log.error('轮询超时')
          this.$message.error('请求超时')
          this.loading = false
          return
        }
        const res = await apis.initRepo(this.repo.owner, this.repo.name)
        let data = res.data

        this.$log.debug('轮询中...次数' + this.attemptCount)
        this.$log.info('轮询结果：' + data)

        if (data === 0) {
          // 未初始化完成，继续轮询
          await new Promise(resolve => setTimeout(resolve, 2000))
          this.attemptCount++
        } else if (data.data === 1) {
          // 初始化完成，停止轮询
          this.$log.info('轮询完成')
          this.loading = false
          this.setParentRepo()
          this.$message.success('初始化成功')
        } else if (data.data === 2) {
          // repo 不存在
          this.$log.error('Repo 不存在')
          this.loading = false
          this.$message.error('该仓库不存在')
        } else if (data.data === 3) {
          this.$log.error('Repo 不存在 Issues')
          this.loading = false
          this.$message.error('该仓库不存在 Issues')
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
}

.icon-text span {
    flex: 1;
    min-width: 100px;
    text-align: center;
}
</style>
