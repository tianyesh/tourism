<template>
  <div class="fullPage">
    <div class="left">
      <el-menu default-active="2" class="el-menu-vertical-demo"
        background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
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
    data() {
      return {}
    },
    mounted() {},
    computed: {
      ...mapState(['adminInfo']),
    },
    methods: {
      ...mapActions(['getAdminData']),
      async submitForm(formName) {

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
