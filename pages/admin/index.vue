<template>
  <div class="fullPage">
    <div class="userBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>管理员</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-tabs type="border-card" class="margin-t-20">
        <el-tab-pane label="用户列表">
          <el-table :data="userList" style="width: 100%" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="序号" width="66" header-align="center">
              <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="user_name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="city" label="地址">
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="120">
            </el-table-column>
            <el-table-column property="" label="操作" width="200" align="center" header-align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="danger" @click="delUser(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配置管理">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
      </el-tabs>
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
    delUser
  } from '../../api/getData'
  import _ from 'lodash';
  export default {
    data() {
      return {
        selectUserList: [],
        userList: [],
        userIds: []
      }
    },
    mounted() {
      this.getUserList();
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods: {
      ...mapActions(['getAdminData']),
      async submitForm(formName) {
      },
      // 选择、取消上传文件钩子方法
      handleSelectionChange(val) {
        this.selectUserList = val;
        this.userIds = [];
        _.forEach(this.selectUserList, (value) => {
          this.userIds.push(value.checkId);
        });
      },
      // 获取用户列表
      async getUserList() {
        const res = await getUserList();
        this.userList = res.data;
      },
      // 删除用户
      async delUser(row) {
        console.log(row.id);
        await delUser(row.id);
      }
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
