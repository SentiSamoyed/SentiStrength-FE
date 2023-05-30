<template>
  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
          <span>基本信息</span>
        </div>
      </div>
    </template>

    <el-descriptions id='descriptions' column='2'>
      <el-descriptions-item label='项目 ID'>{{ this.repoInfo.id }}</el-descriptions-item>
      <el-descriptions-item label='项目名称'>
        <el-tag type='success'>
          {{ this.repoInfo.fullName }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label='项目地址'>
        <el-link :href=this.repoInfo.htmlUrl :underline='false' target='_blank' type='primary'>
          {{ this.repoInfo.htmlUrl }}
        </el-link>
      </el-descriptions-item>
      <el-descriptions-item label='上次更新时间'>{{ new Date(this.repoInfo.lastUpdate).toDateString() }}
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script>

import apis from '@/apis'

export default {
  name: 'RepoInfo',
  mounted() {
    this.currRepo = this.$parent.$data.repo
    apis.getRepoInfo(this.currRepo.owner, this.currRepo.name).then(res => {
      this.repoInfo = res.data.data
    }).catch(err => {
      this.$message.error('获取仓库信息异常: ' + err)
    })
  },
  data() {
    return {
      currRepo: {
        owner: '',
        name: ''
      },
      repoInfo: {
        id: -1,
        owner: '',
        name: '',
        fullName: '',
        htmlUrl: '',
        lastUpdate: 0
      }
    }
  },
  methods: {}
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

.el-progress .el-progress--line {
    margin-bottom: 15px;
    width: 350px;
}

#descriptions {
    padding: 0 3rem;
}
</style>
