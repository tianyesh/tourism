<template>
  <div class="fullPage">
    <div class="userBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>管理员</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-tabs type="border-card" class="margin-t-20" v-model="activeType">
        <el-tab-pane label="用户列表" name="用户列表">
          <el-table :data="userList" style="width: 100%" border>
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
                  <el-button @click="changeFormStatus(scope.row)">编辑</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="添加用户" name="添加用户">
          <el-form :model="addUserForm" :rules="addUserRules" style="width:600px;margin: 40px auto;" ref="addUserForm">
            <el-form-item label="用户名" prop="userName">
              <el-input style="width: 300px" v-model="addUserForm.userName" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              &nbsp;&nbsp;<el-input style="width: 300px" type="password" placeholder="密码" v-model="addUserForm.password"></el-input>
            </el-form-item>
            <el-form-item label="城市" prop="city">
              &nbsp;&nbsp;&nbsp;&nbsp;<el-input style="width: 300px" placeholder="城市" v-model="addUserForm.city"></el-input>
            </el-form-item>
          </el-form>
          <div style="width:600px;margin: 0px auto; text-align:center;">
            <el-button type="primary" @click="addUser('addUserForm')" plain>确 定</el-button>
            <el-button @click="resetForm('addUserForm')">清空</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="编辑用户" :visible.sync="isShowForm" width="500px">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="用户名" prop="userName">
          <el-input style="width: 300px" v-model.trim="editForm.userName" autocomplete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          &nbsp;&nbsp;&nbsp;&nbsp;<el-input style="width: 300px" v-model.trim="editForm.city" autocomplete="off" placeholder="城市"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUser('editForm')" plain>确 定</el-button>
        <el-button @click="isShowForm=false">取 消</el-button>
      </div>
    </el-dialog>
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
        selectUserList: [],
        userList: [],
        isShowForm: false,
        activeType: '用户列表',
        id: '',
        editForm: {
          userName: '',
          city: ''
        },
        editRules: {
          userName: [{
            required: true,
            validator: async (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入用户名'));
                return false;
              } else if (value.length > 50) {
                callback(new Error('用户名不能大于50位'));
                return false;
              }
            },
            trigger: 'blur'
          }]
        },
        addUserForm: {
          userName: '',
          password: '',
          city: ''
        },
        addUserRules: {
          userName: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }, ],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
        },
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
      // 获取用户列表
      async getUserList() {
        const res = await getUserList();
        this.userList = res.data;
      },
      // 编辑用户表单
      changeFormStatus(row) {
        this.isShowForm = true;
        this.id = row.id;
        console.log(this.id)
      },
      // 添加用户
      async addUser(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            const res = await addUser(this.addUserForm);
            if ( res.status===1 ) {
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.resetForm(formName);
              this.activeType = '用户列表';
              this.getUserList();
            } else {
              this.$message({
                type: 'error',
                message: `${res.message}`
              });
            }
          }
        });
      },
      // 清空、重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 编辑用户
      async editUser(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            const res = await editUser(this.id, this.editForm);
            if ( res.status===1 ) {
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.getUserList();
            } else {
              this.$message({
                type: 'error',
                message: `${res.message}`
              });
            }
            this.isShowForm = false;
            this.resetForm(formName);
          }
        });
      },
      // 删除用户
      async delUser(row) {
        this.$confirm('是否确认删除？', '提示', { type: 'warning' }).then(async () => {
          const res = await delUser(row.id);
          if ( res.status===1 ) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getUserList();
          } else {
            this.$message({
              type: 'error',
              message: `${res.message}`
            });
          }
        })
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
