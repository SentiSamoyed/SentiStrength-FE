<template>
  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
          <span>初始化项目</span>
        </div>
      </div>
    </template>

    <el-form :model='form' label-width='200px'>
      <el-form-item label='项目名称'>
        <el-input placeholder='请输入项目名称' clearable v-model='form.repoPath' style='width: 20.5%'>
          <template #prefix>
            <font-awesome-icon icon='fa-solid fa-search' />
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <div class='button-container'>
      <el-button type='primary' @click='initRepo()'>下一步</el-button>
    </div>
  </el-card>
</template>

<script>
import apis from '@/apis'

export default {
  name: 'RepoInit',
  data() {
    return {
      form: {
        repoPath: ''
      },
    }
  },
  methods: {
    initRepo() {
      apis.initRepo(this.form.repoPath).then(res => {
        this.$parent.$data.repo = this.form.repoPath
        this.$message.success('初始化成功')
      }).catch(err => {
        this.$message.error('初始化失败: ' + err)
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

.checkboxes {
    margin: 1rem;
}

.checkbox {
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
