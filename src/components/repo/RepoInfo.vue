<template>
  <card>
    <template #icon-text>
      <font-awesome-icon icon='fa-solid fa-info' />
      <span>基本信息</span>
    </template>

    <template #body>
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
    </template>
  </card>
</template>

<script>

import apis from '@/apis'
import Card from '@/components/common/Card.vue'

export default {
  name: 'RepoInfo',
  components: { Card },
  mounted() {
    this.repo = this.$parent.$data.repo
    this.loading = true
    apis.getRepoInfo(this.repo.owner, this.repo.name).then(res => {
      let data = res.data.data
      this.$log.debug('Get repo info: ', data)
      // 如果 lastUpdate 为 null，则需要重新调用 init api
      if (data.lastUpdate === null) {
        apis.initRepo(this.repo.owner, this.repo.name)
        this.$message.warning({ message: '项目需要重新初始化，请稍后再来...', duration: 5000 })
      }
      this.repoInfo = res.data.data
    }).catch(err => {
      this.$message.error('获取仓库信息异常: ' + err)
    }).finally(() => {
      this.loading = false
    })
  },
  data() {
    return {
      repo: {
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
      },
      loading: false
    }
  },
  methods: {}
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

#descriptions {
    padding: 0 3rem;
}
</style>
