<template>
  <main>
    <AnalyseOptions ref='AnalyseOptions' />

    <AnalyseText ref='AnalyseText'>
      <template #text>
        <el-input type='textarea' rows='4' placeholder='请输入文本' v-model='form.text'
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
      }),
      loading: false
    }
  },
  methods: {
    submit() {
      this.loading = true

      let data = {
        text: this.$data.form.text,
        mode: this.$refs.AnalyseOptions.form.mode,
        explain: this.$refs.AnalyseOptions.form.explain,
        options: this.$refs.AnalyseOptions.form.options
      }
      const params = {
        url: '/api/sentiment/analysis/text',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: data
      }

      axios(params)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
          window.alert('请求失败' + '\n' + err)
        }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style>
</style>
