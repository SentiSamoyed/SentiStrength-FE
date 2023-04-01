<template>
  <main>
    <AnalyseOptions ref='AnalyseOptions' />

    <AnalyseText ref='AnalyseText'>
      <template #text>
        <el-input type='text' placeholder='请输入语句' v-model='form.text' style='margin: 1rem; width: 400px' />
      </template>
      <template #file>
        <el-input type='textarea' rows='4' placeholder='请输入文本内容' v-model='form.file'
                  style='margin: 1rem; width: 400px' />
      </template>
      <template #button>
        <el-button type='primary' @click='submit'>提交</el-button>
      </template>
    </AnalyseText>

    <AnalyseResult>
      <template #skeleton>
        <el-skeleton v-if='loading' animated />
      </template>
    </AnalyseResult>
  </main>
</template>

<style>

</style>
<script>
import AnalyseOptions from '@/components/AnalyseOptions.vue'
import { reactive } from 'vue'
import AnalyseText from '@/components/AnalyseText.vue'
import AnalyseResult from '@/components/AnalyseResult.vue'
import axios from 'axios'

export default {
  name: 'HomeView',
  components: { AnalyseResult, AnalyseText, AnalyseOptions },
  data() {
    return {
      form: reactive({
        text: '',
        file: ''
      }),
      loading: false
    }
  },
  methods: {
    submit() {
      this.loading = true

      let data = {
        mode: this.$refs.AnalyseOptions.form.mode,
        explain: this.$refs.AnalyseOptions.form.explain,
        options: this.$refs.AnalyseOptions.form.options
      }
      const params = {
        url: import.meta.env.VITE_BACKEND_URL + '/sentiment/analysis',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: data
      }
      const activeTabName = this.$refs.AnalyseText.$data.activeTabName
      if (activeTabName === 'text') {
        data.text = this.$data.form.text
        params.url += '/text'
      } else if (activeTabName === 'file') {
        data.file = this.$data.form.file
        params.url += '/file'
      }

      axios(params)
        .then(res => {
          window.alert('请求成功')
          this.$refs.AnalyseResult.$data.result = res.result
        })
        .catch(err => {
          console.log(err)
          window.alert('请求失败')
        }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style>
</style>
