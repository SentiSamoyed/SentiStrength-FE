<template>

  <el-menu
    default-active='/'
    class='el-menu-vertical-demo'
    router
  >
    <div class='header'>
       <span class='header-text'>
         <span>SentiStrength</span>
       </span>
    </div>
    <el-menu-item index='/' class='menu-item'>
      <span>主页</span>
    </el-menu-item>
    <el-menu-item index='/analyse' class='menu-item'>
      <span>开始分析</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang='ts' setup>
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    height: 100%;
    background: #242d3d;
}

.header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 5rem;
    color: white;
}


.menu-item {
    color: white;
}

.menu-item:hover {
    background: #354056;
}

.header-text {
    font-size: 1.2rem;
    font-weight: bold;
}
</style>
