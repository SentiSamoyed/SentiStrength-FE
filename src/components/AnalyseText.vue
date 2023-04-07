<template>
  <el-card>
    <template #header>
      <div class='card-header'>
        <span>分析内容</span>
      </div>
    </template>

    <el-form>
      <span style='margin: 1rem'>输入文本：</span>
      <el-form-item>
        <slot name='text'>
        </slot>
      </el-form-item>
    </el-form>

    <div class='button-container'>
      <slot name='button' class='button'></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'AnalyseText',
  data() {
    return {}
  },
  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.call(this))
    }
  }
}
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end;
}

.button {

}
</style>
