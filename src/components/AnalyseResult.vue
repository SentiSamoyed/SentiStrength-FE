<template>
  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <span>分析结果</span>
      </div>
    </template>

    <span class='result'>

      </span>

    <slot name='skeleton'></slot>

  </el-card>
</template>

<script>
export default {
  name: 'AnalyseResult.vue'
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
</style>
