<template>

  <el-card class='card' shadow='hover'>
    <template #header>
      <div class='card-header'>
        <div class='icon-text'>
          <slot name='icon-text' />
        </div>
        <slot name='header' />
      </div>
    </template>
    <slot name='body'></slot>
  </el-card>
</template>

<script>
export default {
  name: 'Card'
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
