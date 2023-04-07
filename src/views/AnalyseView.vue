<template>
  <main>
    <AnalyseOptions ref='AnalyseOptions' />

    <AnalyseText ref='AnalyseText'>
      <template #text>
        <el-input type='textarea' rows='4' placeholder='请输入文本' v-model='form.text'
                  style='margin: 1rem;' />
      </template>
      <template #button>
        <el-button type='primary' @click='submit'>提交</el-button>
      </template>
    </AnalyseText>

    <AnalyseResult>

      <template #table>
        <el-table :data='tableData' v-loading='loading' height='600px'>
          <el-table-column prop='val1' label='Positive' width='180'></el-table-column>
          <el-table-column prop='val2' label='Negative' width='180'></el-table-column>
          <el-table-column prop='val3' label='Mode Value' width='180'></el-table-column>
          <el-table-column prop='explain' label='Explain'></el-table-column>
        </el-table>
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
        text: ''
      }),
      loading: false,
      tableData: []
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
          if (res.data.code !== 0) {
            window.alert('请求失败' + '\n' + res.data.msg)
            return
          }
          this.tableData = res.data.data
        })
        .catch(err => {
          console.log(err)
          window.alert('请求失败' + '\n' + err.message)
        }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style>
</style>
