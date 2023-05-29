<template>

  <el-menu
    active-text-color='#ffd04b'
    background-color='#242d3d'
    :default-active='this.$route.path'
    router
    style='height: 100%'
    text-color='#fff'
  >
    <div class='header'>
       <span class='header-text'>
         <span>SentiStrength</span>
       </span>
    </div>
    <el-menu-item class='menu-item' index='/'>
      <font-awesome-icon class='icon' icon='fa-solid fa-house-user' />
      <span>主页</span>
    </el-menu-item>
    <el-menu-item class='menu-item' index='/analyse'>
      <font-awesome-icon class='icon' icon='fa-solid fa-magnifying-glass-chart' />
      <span>文本分析</span>
    </el-menu-item>
    <el-menu-item class='menu-item' index='/repo'>
      <font-awesome-icon class='icon' icon='fa-brands fa-github' />
      <span>项目分析</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
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
