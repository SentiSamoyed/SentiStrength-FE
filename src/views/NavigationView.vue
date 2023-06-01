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
    <el-sub-menu class='sub-menu'>
      <template #title>
        <div class='sub-menu-title'>
          <font-awesome-icon class='icon' icon='fa-solid fa-tags' />
          <span>标注展示</span>
        </div>
      </template>
      <el-menu-item class='menu-item' index='/label-graph'>
        <font-awesome-icon class='icon' icon='fa-solid fa-chart-simple' />
        <span>热力图&折线图</span>
      </el-menu-item>
      <el-menu-item class='menu-item' index='/label-doc'>
        <font-awesome-icon class='icon' icon='fa-solid fa-file' />
        <span>说明</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import { defineComponent } from 'vue'
import { PriceTag } from '@element-plus/icons-vue'

export default defineComponent({
  components: { PriceTag }
})
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

.el-sub-menu__title {
    padding-right: 20px;
}

.sub-menu-title {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
}

.sub-menu-title .icon {
    flex: 1;
}

.sub-menu-title span {
    flex: 2;
}

</style>
