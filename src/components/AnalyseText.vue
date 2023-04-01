<template>
  <el-card>
    <template #header>
      <div class='card-header'>
        <span>分析内容</span>
      </div>
    </template>

    <el-tabs v-model='activeTabName' :tab-position='"left"' style='height: 200px'>
      <el-tab-pane label='语句' name='text'>
        <el-form>
          <span style='margin: 1rem'>输入单个语句：</span>
          <el-form-item>
            <slot name='text'>
            </slot>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label='文本' name='file'>
        <el-form>
          <span style='margin: 1rem'>输入一个文本的所有内容：</span>
          <el-form-item>
            <slot name='file'>
            </slot>
          </el-form-item>
        </el-form>
      </el-tab-pane>

    </el-tabs>
    <div class='button-container'>
      <slot name='button' class='button'></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'AnalyseText',
  props: {
    label: {
      type: String,
      default: '输入语句'
    }
  },
  data() {
    return {
      activeTabName: 'text'
    }
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
