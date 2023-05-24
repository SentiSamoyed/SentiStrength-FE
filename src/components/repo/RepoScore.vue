<template>
  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
          <span>项目分值</span>
        </div>
      </div>
    </template>

    <el-form :model='form' label-width='200px'>
      <el-form-item label='版本'>
        <el-select
          v-model='this.selectedVersions'
          multiple
          filterable
          clearable
          placeholder='请选择版本'
        >
          <template #prefix>
            <font-awesome-icon icon="fa-solid fa-code-compare" />
          </template>
          <el-option
            v-for='item in this.versions'
            :key='item.value'
            :label='item.label'
            :value='item.value'
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>


    <div>
      <span>平均分值：{{repoScore}}</span>
      <span>分值总和：{{repoScore}}</span>
    </div>
    <div class='button-container'>
      <el-button type='primary' @click='getRepoScore'>提交</el-button>
    </div>
  </el-card>

</template>

<script>
import apis from '@/apis'

export default {
  name: 'RepoScore',
  data() {
    return {
      form: {},
      selectedVersions: [],
      versions: [
        {
          value: '1.0.0',
          label: '1.0.0'
        },
        {
          value: '1.0.1',
          label: '1.0.1'
        },
        {
          value: '1.0.2',
          label: '1.0.2'
        }
      ],
      repoScore: 0,
    }
  },
  methods: {
    getRepoScore() {
      let selectedVersions = this.selectedVersions
      apis.getRepoScore(this.$parent.$data.repo, selectedVersions).then(res => {

        this.$message.success('请求成功')
      }).catch(err => {
        this.$message.error('请求失败: ' + err)
      })
    }
  }
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

.icon-text {
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-text span {
    flex: 1;
    min-width: 100px;
    text-align: center;
}

</style>
