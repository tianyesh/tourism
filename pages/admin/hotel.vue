<template>
  <div class="fullPage">
    <div class="userBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>管理员</el-breadcrumb-item>
        <el-breadcrumb-item>酒店管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-tabs type="border-card" class="margin-t-20" v-model="activeType">
        <el-tab-pane label="酒店列表" name="酒店列表">
          <el-table :data="hotelList" style="width: 100%" border @sort-change="sortChange" :default-sort = "{prop: 'create_time', order: 'descending'}">
            <el-table-column label="序号" width="66" header-align="center">
              <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" width="120">
            </el-table-column>
            <el-table-column prop="city" label="地址">
              <template slot-scope="scope">
                <div>{{scope.row.province}} {{scope.row.city}} {{scope.row.address}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="" label="酒店简介">
              <template slot-scope="scope">
                <div class="two-line" :title="scope.row.introduce">{{scope.row.introduce}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="telephone" label="电话">
            </el-table-column>
            <el-table-column prop="score" sortable label="评分" width="80">
            </el-table-column>
            <el-table-column prop="create_time" sortable label="创建时间" width="110">
            </el-table-column>
            <el-table-column property="" label="操作" width="220" align="center" header-align="center">
              <template slot-scope="scope">
                <div>
                  <el-button size="mini" type="danger" @click="delUser(scope.row)">删除</el-button>
                  <el-button size="mini" @click="changeDetails(scope.row, true)">详情</el-button>
                  <el-button size="mini" @click="changeFormStatus(scope.row)">编辑</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="添加酒店" name="添加酒店">
          <!-- <el-form :model="addUserForm" :rules="addUserRules" style="width:600px;margin: 40px auto;" ref="addUserForm">
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
          </div> -->
        </el-tab-pane>
        <el-dialog title="酒店详情" :visible.sync="isShowDetails" width="800px">
          <div class="content">
            <ul>
              <li>
                <span class="title">名称：</span>
                <span>{{form.name}}</span>
              </li>
              <li>
                <span class="title">简介：</span>
                <span>{{form.introduce}}</span>
              </li>
              <li>
                <span class="title">地址：</span>
                <span>{{form.province}} {{form.city}} {{form.address}}</span>
              </li>
              <li>
                <span class="title">电话：</span>
                <span>{{form.telephone}}</span>
              </li>
              <li>
                <span class="title">评分：</span>
                <span>{{form.score}}</span>
              </li>
              <li>
                <span class="title">酒店图片：</span>
                <span>{{form.image_url}}</span>
              </li>
              <li>
                <span class="title">创建时间：</span>
                <span>{{form.create_time}}</span>
              </li>
              <li>
                <span class="title">房间信息：</span>
                <div>
                  <ul v-for="item in form.sub_room" :key="item.room_id">
                    <li>
                      <span class="title">房型：</span>
                      <span>{{item.room_name}}</span>
                    </li>
                    <li>
                      <span class="title">上网：</span>
                      <span>{{item.wifi?'有':'无'}}</span>
                      <span class="title margin-l-30">有窗：</span>
                      <span>{{item.window?'有':'无'}}</span>
                      <span class="title margin-l-30">面积：</span>
                      <span>{{item.area}}</span>
                      <span class="title margin-l-30">早餐：</span>
                      <span>{{item.breakfast?'有':'无'}}</span>
                    </li>
                    <li>
                      <span class="title">可住人数：</span>
                      <span>{{item.hold_num}}</span>
                      <span class="title margin-l-30">价格：</span>
                      <span>{{item.price}}</span>
                      <span class="title margin-l-30">剩余数量：</span>
                      <span>{{item.surplus_num}}</span>
                    </li>
                    <li>
                      <span class="title">图片：</span>
                      <span>{{item.image_url}}</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </el-dialog>
        <el-dialog title="编辑酒店" :visible.sync="isShowEditDetails" width="800px">
          <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-form-item label="酒店名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="酒店简介" prop="introduce">
              <el-input type="textarea" v-model="form.introduce"></el-input>
            </el-form-item>
            <el-form-item label="省" prop="province">
              <el-col :span="11">
                <el-select v-model="form.province" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="即时配送" prop="delivery">
              <el-switch v-model="form.delivery"></el-switch>
            </el-form-item>
            <el-form-item label="活动性质" prop="type">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                <el-checkbox label="地推活动" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="特殊资源" prop="resource">
              <el-radio-group v-model="form.resource">
                <el-radio label="线上品牌商赞助"></el-radio>
                <el-radio label="线下场地免费"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="活动形式" prop="desc">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
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
    getHotelList
  } from '../../api/getData'
  import _ from 'lodash';
  export default {
    data() {
      return {
        isShowDetails: false,
        activeType: '酒店列表',
        isShowEditDetails: false,
        hotelList: [],
        form: {}
      }
    },
    mounted() {
      this.getHotelList();
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods: {
      ...mapActions(['getAdminData']),
      async getHotelList() {
        const res = await getHotelList();
        this.hotelList = res.data;
      },
      sortChange(column, prop, order) {
        console.log( column, prop, order);
      },
      changeDetails(row, mark) {
        this.isShowDetails = mark;
        if (mark) {
          this.form = row;
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
  .two-line{
    white-space: initial !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    height: 48px;
  }
  .content{
    width: 600px;
    margin: 20px auto;
    li{
      margin-top: 10px;
    }
    .title{
      font-weight: bold;
    }
  }
  .margin-l-30{
    margin-left: 30px;
  }
</style>
