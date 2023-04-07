<template>
  <el-card
    shadow='hover'
  >
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <font-awesome-icon icon='fa-solid fa-file-lines' class='icon' />
          <span>分析内容</span>
        </div>
        <div></div>
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

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
