<template>
  <main>
    <AnalyseOptions ref='AnalyseOptions' />

    <AnalyseText ref='AnalyseText'>
      <template #text>
        <el-input type='textarea' :autosize='{ minRows: 4, maxRows: 10 }' placeholder='请输入文本' v-model='form.text'
                  style='margin: 1rem;' />
      </template>
      <template #button>
        <el-button type='primary' @click='submit'>提交</el-button>
      </template>
    </AnalyseText>

    <AnalyseResult>
      <template #button>
        <el-button type='primary' @click='exportCsv'>导出</el-button>
      </template>

      <template #table>
        <el-table :data='tableData' :table-layout='"auto"' v-loading='loading' height='600px'>
          <el-table-column prop='id' label='Id' width='40px' />
          <el-table-column prop='text' label='Text'></el-table-column>
          <el-table-column prop='val1' label='Positive' width='100px'></el-table-column>
          <el-table-column prop='val2' label='Negative' width='100px'></el-table-column>
          <el-table-column prop='val3' label='Mode Value' width='110px'></el-table-column>
          <el-table-column prop='explain' label='Explain'></el-table-column>
        </el-table>
      </template>
    </AnalyseResult>
  </main>
</template>

<style>

</style>
<script>
import AnalyseOptions from '@/components/analyse/AnalyseOptions.vue'
import { reactive } from 'vue'
import AnalyseText from '@/components/analyse/AnalyseText.vue'
import AnalyseResult from '@/components/analyse/AnalyseResult.vue'
import axios from 'axios'
import { ExportToCsv } from 'export-to-csv'

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

      let textArr = this.splitText(this.$data.form.text)
      this.tableData = Array(textArr.length).fill().map((_, index) => ({ id: index + 1, text: textArr[index] }))

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
            this.$message.error('请求失败: ' + res.data.msg)
            return
          }
          // set table data
          res.data.data.forEach((item, index) => {
            const targetObj = this.tableData[index]
            Object.assign(targetObj, { val1: item.val1, val2: item.val2, val3: item.val3, explain: item.explain })
          })
          this.$message.success('请求成功')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求失败: ' + err.message)
        }).finally(() => {
        this.loading = false
      })
    },
    splitText(text) {
      return text.split('\n')
    },
    exportCsv() {
      return new Promise(() => {
        const options = {
          showLabels: true,
          showTitle: false,
          filename: 'sentistrength-result-' + this.$refs.AnalyseOptions.form.mode,
          useTextFile: false,
          useBom: true,
          useKeysAsHeaders: false,
          headers: ['id', 'text', 'val1', 'val2', 'val3', 'explain']
        }

        const csvExporter = new ExportToCsv(options)
        csvExporter.generateCsv(this.tableData)
      }).then(() => {
        this.$message.success('导出成功')
        console.log('导出成功')
      }).catch(err => {
        console.log(err)
        this.$message.error('导出失败: ' + err.message)
      })
    }

  }
}
</script>
<style>
</style>
