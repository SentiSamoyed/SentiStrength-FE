<template>
  <card>
    <template #icon-text>
      <font-awesome-icon class='icon' icon='fa-solid fa-file-lines' />
      <span>分析内容</span>
    </template>

    <template #body>
      <el-form>
        <span style='margin: 1rem'>输入文本：</span>
        <el-form-item>
          <slot name='text'>
          </slot>
        </el-form-item>
      </el-form>
      <div class='button-container'>
        <slot class='button' name='button'></slot>
      </div>
    </template>
  </card>

</template>

<script>
import Card from '@/components/common/Card.vue'

export default {
  name: 'TextInput',
  components: { Card },
  data() {
    return {}
  }
}
</script>

<style scoped>
.button-container {
    display: flex;
    justify-content: flex-end;
}

span {
    flex: 1;
    min-width: 100px;
    text-align: center;
}

</style>
