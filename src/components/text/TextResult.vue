<template>
  <card>
    <template #icon-text>
      <font-awesome-icon class='icon' icon='fa-solid fa-table' />
      <span>分析结果</span>
    </template>
    <template #header>
      <slot name='button'></slot>
    </template>
    <template #body>
      <slot name='table'></slot>
    </template>
  </card>

</template>

<script>
import Card from '@/components/common/Card.vue'

export default {
  name: 'AnalyseResult.vue',
  components: { Card }
}
</script>
<style scoped>
span {
    flex: 1;
    min-width: 100px;
    text-align: center;
}
</style>
