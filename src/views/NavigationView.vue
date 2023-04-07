<template>

  <el-menu
    default-active='/'
    background-color='#242d3d'
    text-color='#fff'
    active-text-color='#ffd04b'
    router
    style='height: 100%'
  >
    <div class='header'>
       <span class='header-text'>
         <span>SentiStrength</span>
       </span>
    </div>
    <el-menu-item index='/' class='menu-item'>
      <font-awesome-icon icon='fa-solid fa-house-user' class='icon' />
      <span>主页</span>
    </el-menu-item>
    <el-menu-item index='/analyse' class='menu-item'>
      <font-awesome-icon icon='fa-solid fa-magnifying-glass-chart' class='icon' />
      <span>开始分析</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang='ts' setup>
</script>

<style>

.header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 5rem;
    color: white;
}

.menu-item {
    display: flex;
    align-items: center;
    justify-content: center;
}


.menu-item .icon {
    flex: 1;
}

.el-menu-item span {
    flex: 2;
}

.header-text {
    font-size: 1.2rem;
    font-weight: bold;
}
</style>
