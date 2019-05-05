<template>
  <div class="fullPage">
    <div class="left">
      <el-menu default-active="2" class="el-menu-vertical-demo"
        background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span>数据管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/admin">用户管理</el-menu-item>
            <el-menu-item index="/admin/category">分类管理</el-menu-item>
            <el-menu-item index="/admin/hotel">酒店管理</el-menu-item>
            <el-menu-item index="/admin/travel">景点管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right">
      <nuxt-child keep-alive/>
    </div>
  </div>
</template>

<script>
  import {
    mapActions,
    mapState
  } from 'vuex'
  export default {
    layout: 'admin',
    data() {
      return {}
    },
    mounted() {
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods: {
      ...mapActions(['getAdminData']),
      handleSelect(url) {
        this.$router.push(url);
      }
    }
  }

</script>
<style lang="less" scoped>
  @import '../style/common.less';
  @import '../style/mixin.less';

  .fullPage {
    height: 100%;
    width: 100%;
    margin: 0 auto;
    display: flex;

    .left {
      width: 200px;
      height: 100%;
      background-color: rgb(84, 92, 100);
    }

    .right {
      flex-grow: 1;
      background-color: #fff;
    }
  }

</style>
