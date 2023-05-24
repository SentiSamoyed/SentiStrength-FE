<template>
  <main>

    <!--未初始化项目时显示-->
    <RepoInit>
    </RepoInit>

    <!--已初始化项目时显示-->
    <RepoScore>
    </RepoScore>

    <RepoGraph/>

  </main>
</template>
<script>
import RepoInit from '@/components/repo/RepoInit.vue'
import RepoScore from '@/components/repo/RepoScore.vue'
import RepoGraph from '@/components/repo/RepoGraph.vue'

export default {
  name: 'RepoAnalyseView',
  components: { RepoGraph, RepoScore, RepoInit },
  data() {
    return {
      // 初始化后的项目路径
      repo: 'repo',
    }
  },
  methods: {


  }
}
</script>
