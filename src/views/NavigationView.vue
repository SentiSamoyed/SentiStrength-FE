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
      <font-awesome-icon icon='fa-solid fa-house-user' class='icon'/>
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
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-item:hover {
    background: #354056;
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
