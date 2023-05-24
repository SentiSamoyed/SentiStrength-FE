<template>
  <el-card class='card' shadow='hover'>
    <div class='card-header'>
      <div class='icon-text'>
        <font-awesome-icon class='icon' icon='fa-solid fa-sliders' />
        <span>初始化项目</span>
      </div>
      <el-button type='primary' @click='reset'>重置</el-button>
    </div>

    <el-input placeholder='请输入项目名称' v-model='form.repoPath' style='width: 20rem; margin: 1rem 0'>
      <template #prefix>
        <font-awesome-icon icon='fa-solid fa-search' />
      </template>
    </el-input>

    <div class='button-container'>
      <slot class='button' name='button'></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'RepoInit',
  data() {
    return {
      form: {
        repoPath: ''
      }
    }
  },
  methods: {
    reset() {

      this.$message.success('已重置选项')
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
