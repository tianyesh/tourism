<template>
  <div class="fullPage">
    <div class="userBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>管理员</el-breadcrumb-item>
        <el-breadcrumb-item>景点管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
  import {
    mapActions,
    mapState
  } from 'vuex'
  import {
    getUserList,
    editUser,
    addUser,
    delUser
  } from '../../api/getData'
  import _ from 'lodash';
  export default {
    data() {
      return {
      }
    },
    mounted() {
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods: {
      ...mapActions(['getAdminData']),
    }
  }

</script>
<style lang="less" scoped>
  .userBox {
    width: 100%;
    padding: 20px;
  }

  .margin-t-20 {
    margin-top: 20px;
  }

</style>
