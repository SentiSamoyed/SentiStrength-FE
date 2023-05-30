<template>
  <main>

    <!--测试用-->
    <!--    <span>owner: {{ repo.owner }}</span>-->
    <!--    <span>name: {{ repo.name }}</span>-->

    <!--未初始化项目时显示-->
    <RepoInit ref='RepoInit' v-if='repo.owner === ""'>
    </RepoInit>

    <!--已初始化项目时显示-->
    <RepoScore v-if='repo.owner !== ""'>
    </RepoScore>

    <RepoGraph v-if='repo.owner !== ""' />

  </main>
</template>
<script>
import RepoInit from '@/components/repo/RepoInit.vue'
import RepoScore from '@/components/repo/RepoScore.vue'
import RepoGraph from '@/components/repo/RepoGraph.vue'
import apis from '@/apis'

export default {
  name: 'RepoAnalyseView',
  components: { RepoGraph, RepoScore, RepoInit },
  data() {
    return {
      // 初始化后的项目信息
      repo: {
        owner: '',
        name: ''
      },
      repoList: []
    }
  },
  mounted() {
    apis.getRepoList().then(res => {
      let data = res.data
      if (data.code === 0) {
        this.$log.info('Get repo list: ', data.data)
        this.repoList = data.data
      } else {
        this.$log.error('Get repo list failed: ', data.msg)
        this.$message.error('获取项目列表失败: ' + data.msg)
      }
    }).catch(err => {
      this.$log.error('Get repo list failed: ', err)
      this.$message.error('获取项目列表失败: ' + err)
    })
  },
  methods: {}
}
</script>
