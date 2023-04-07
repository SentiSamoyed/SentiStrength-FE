<script setup>
import { RouterView } from 'vue-router'
import NavigationView from '@/views/NavigationView.vue'</script>

<template>
  <el-container class='main-container'>
    <el-aside class='el-aside'>
      <NavigationView />
    </el-aside>

    <el-container class='content-container'>
      <el-main class='el-main'>
        <RouterView />
      </el-main>
    </el-container>

  </el-container>
</template>

<style scoped>

.main-container {
    width: 100%;
}

.content-container {
    padding: 1rem 1rem 1rem 1rem;
    margin: 1rem 1rem 1rem 1rem;
}

.el-aside {
    width: 200px;
    background-color: #d3dce6;
    transition: var(--el-transition-all);
}

.el-aside:hover {
    box-shadow: var(--el-box-shadow);
}

.el-main {
    padding: 2rem;
}

</style>
