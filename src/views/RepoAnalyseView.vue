<template>
  <main>

    <!--未初始化项目时显示-->
    <RepoInit ref='RepoInit' v-if='this.repo === ""'>
      <template #button>
        <el-button type='primary' @click='initRepo'>下一步</el-button>
      </template>
    </RepoInit>

    <!--已初始化项目时显示-->

  </main>
</template>
<script>
import RepoInit from '@/components/repo/RepoInit.vue'
import apis from '@/apis'

export default {
  name: 'RepoAnalyseView',
  components: { RepoInit },
  data() {
    return {
      // 初始化后的项目路径
      repo: ''
    }
  },
  methods: {
    initRepo() {
      let repoPath = this.$refs.RepoInit.form.repoPath
      apis.initRepo(repoPath).then(res => {
        this.repo = repoPath
        this.$message.success('初始化成功')
      }).catch(err => {
        this.$message.error('初始化失败: ' + err)
      })
    }
  }
}
</script>
