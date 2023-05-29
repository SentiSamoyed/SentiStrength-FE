<template>
  <main>
    <AnalyseOptions ref='AnalyseOptions' />

    <AnalyseText ref='AnalyseText'>
      <template #text>
        <el-input v-model='form.text' :autosize='{ minRows: 4, maxRows: 10 }' placeholder='请输入文本'
                  style='margin: 1rem;'
                  type='textarea' />
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
        <el-table v-loading='loading' :data='tableData' :table-layout='"auto"' height='600px'>
          <el-table-column label='Id' prop='id' width='40px' />
          <el-table-column label='Text' prop='text'></el-table-column>
          <el-table-column label='Positive' prop='val1' width='100px'></el-table-column>
          <el-table-column label='Negative' prop='val2' width='100px'></el-table-column>
          <el-table-column label='Mode Value' prop='val3' width='110px'></el-table-column>
          <el-table-column label='Explain' prop='explain'></el-table-column>
        </el-table>
      </template>
    </AnalyseResult>
  </main>
</template>

<style>

</style>
<script>
import AnalyseOptions from '@/components/text/TextOptions.vue'
import { reactive } from 'vue'
import AnalyseText from '@/components/text/TextInput.vue'
import AnalyseResult from '@/components/text/TextResult.vue'
import { ExportToCsv } from 'export-to-csv'
import apis from '@/apis'

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

      apis.sentimentAnalysisText(data)
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
          this.$log.error(err)
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
        this.$log.debug('导出成功')
      }).catch(err => {
        this.$log.error('导出失败', err)
        this.$message.error('导出失败: ' + err.message)
      })
    }

  }
}
</script>
<style>
</style>
