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
    <el-menu-item index='/' class='el-menu-item'>
      主页
    </el-menu-item>
    <el-menu-item index='/analyse' class='el-menu-item'>
      开始分析
    </el-menu-item>
  </el-menu>
</template>

<script lang='ts' setup>

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

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

.el-menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.el-menu-item:hover {
  background: #354056;
}

.header-text {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
