<template>
  <div class="fullPage">
    <div class="userBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>管理员</el-breadcrumb-item>
        <el-breadcrumb-item>酒店管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-tabs type="border-card" class="margin-t-20" v-model="activeType" @tab-click="changeType">
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
            <el-table-column prop="" label="评论" width="110">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" @click="showCommentList(scope.row)">评论详情</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="" label="操作" width="220" align="center" header-align="center">
              <template slot-scope="scope">
                <div>
                  <el-button size="mini" type="danger" @click="delHotel(scope.row)">删除</el-button>
                  <el-button size="mini" @click="changeDetails(scope.row, true)">详情</el-button>
                  <el-button size="mini" @click="changeEdit(scope.row, true)">编辑</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="添加酒店" name="添加酒店">
          <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-form-item label="酒店名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="酒店简介" prop="introduce">
              <el-input type="textarea" v-model="form.introduce"></el-input>
            </el-form-item>
            <el-form-item label="省" prop="province">
              <el-col :span="11">
                <el-select v-model="form.province" @change="changeProvince()" placeholder="请选择">
                  <el-option
                    v-for="item in provinceList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="市" prop="city">
              <el-col :span="11">
                <el-select v-model="form.city" @change="changeCity()" placeholder="请选择">
                  <el-option
                    v-for="item in cityList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="telephone">
              <el-input v-model="form.telephone"></el-input>
            </el-form-item>
            <el-form-item label="评分" prop="score">
              <el-rate
                v-model="form.score"
                show-score
                text-color="#ff9900">
              </el-rate>
            </el-form-item>
            <el-form-item label="图片" prop="image_url">
              <el-upload
                class="avatar-uploader"
                :action="origin+baseUrl+'/img/addimg/hotel'"
                :show-file-list="false"
                :on-success="handlHotelAvatarScucess"
                :before-upload="beforeAvatarUpload">
                <img width="200px" height="200px" v-if="form.image_url" :src="baseImgPath + form.image_url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-card class="box-card margin-b-20" v-for="item in form.sub_room" :key="item.room_id">
              <div slot="header" class="clearfix">
                <span>房间信息</span>
                <el-button style="float: right; padding: 3px 0" @click="delRoom(item)" type="text">删除</el-button>
              </div>
              <div class="text item">
                <el-form-item label="房型" prop="room_name">
                  <el-input v-model="item.room_name" class="width-300"></el-input>
                </el-form-item>
                <el-form-item label="上网" prop="wifi">
                  <el-switch
                    v-model="item.wifi"
                    active-text="有"
                    inactive-text="无"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="有窗" prop="window">
                  <el-switch
                    v-model="item.window"
                    active-text="有"
                    inactive-text="无"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="早餐" prop="breakfast">
                  <el-switch
                    v-model="item.breakfast"
                    active-text="有"
                    inactive-text="无"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="面积" prop="area">
                  <el-input v-model="item.area" class="width-300"></el-input>
                </el-form-item>
                <el-form-item label="可住人数" prop="hold_num">
                  <el-input v-model="item.hold_num" class="width-300"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                  <el-input v-model="item.price" class="width-300"></el-input>
                </el-form-item>
                <el-form-item label="剩余数量" prop="surplus_num">
                  <el-input v-model="item.surplus_num" class="width-300"></el-input>
                </el-form-item>
                <el-form-item label="添加房间图片" prop="image_url">
                  <el-upload
                    class="avatar-uploader"
                    :action="origin+baseUrl+'/img/addimg/hotel'"
                    :show-file-list="false"
                    :on-success="function(res, file){handlRoomScucess(res, file, item)}"
                    :before-upload="beforeAvatarUpload">
                    <img width="200px" height="200px" v-if="item.image_url" :src="baseImgPath + item.image_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </div>
            </el-card>
            <el-button type="primary" icon="el-icon-circle-plus" @click="addRoom()">添加房型</el-button>
          </el-form>
          <div style="text-align: center;">
            <el-button type="primary" @click="addHotel()">确定</el-button>
            <el-button>重置</el-button>
          </div>
          
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
                <span>
                  <img width="200px" height="200px" v-if="form.image_url" :src="baseImgPath + form.image_url" class="avatar">
                </span>
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
                      <span v-if="item.image_url">
                        <img style="display:inline-block;margin-right: 10px" width="200px" height="200px" :src="baseImgPath + item.image_url" class="avatar">
                      </span>
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
                <el-select v-model="form.province" @change="changeProvince()" placeholder="请选择">
                  <el-option
                    v-for="item in provinceList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="市" prop="city">
              <el-col :span="11">
                <el-select v-model="form.city" @change="changeCity()" placeholder="请选择">
                  <el-option
                    v-for="item in cityList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="telephone">
              <el-input v-model="form.telephone"></el-input>
            </el-form-item>
            <el-form-item label="评分" prop="score">
              <el-rate
                v-model="form.score"
                disabled
                show-score
                text-color="#ff9900">
              </el-rate>
            </el-form-item>
            <el-form-item label="图片" prop="image_url">
              <el-upload
                class="avatar-uploader"
                :action="origin+baseUrl+'/img/addimg/hotel'"
                :show-file-list="false"
                :on-success="handlHotelAvatarScucess"
                :before-upload="beforeAvatarUpload">
                <img width="200px" height="200px" v-if="form.image_url" :src="baseImgPath + form.image_url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="创建时间" prop="create_time">
              <el-input disabled v-model="form.create_time"></el-input>
            </el-form-item>
            <el-card class="box-card margin-b-20" v-for="item in form.sub_room" :key="item.room_id">
              <div slot="header" class="clearfix">
                <span>房间信息</span>
                <el-button style="float: right; padding: 3px 0" @click="delRoom(item)" type="text">删除</el-button>
              </div>
              <div class="text item">
                <el-form-item label="房型" prop="room_name">
                  <el-input v-model="item.room_name" class="width-300"></el-input>
                </el-form-item>
                <el-form-item label="上网" prop="wifi">
                  <el-switch
                    v-model="item.wifi"
                    active-text="有"
                    inactive-text="无"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="有窗" prop="window">
                  <el-switch
                    v-model="item.window"
                    active-text="有"
                    inactive-text="无"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="早餐" prop="breakfast">
                  <el-switch
                    v-model="item.breakfast"
                    active-text="有"
                    inactive-text="无"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="面积" prop="area">
                  <el-input v-model="item.area" class="width-300"></el-input>
                </el-form-item>
                <el-form-item label="可住人数" prop="hold_num">
                  <el-input v-model="item.hold_num" class="width-300"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                  <el-input v-model="item.price" class="width-300"></el-input>
                </el-form-item>
                <el-form-item label="剩余数量" prop="surplus_num">
                  <el-input v-model="item.surplus_num" class="width-300"></el-input>
                </el-form-item>
                <el-form-item label="房间图片" prop="image_url">
                  <el-upload
                    class="avatar-uploader"
                    :action="origin+baseUrl+'/img/addimg/hotel'"
                    :show-file-list="false"
                    :on-success="function(res, file){handlRoomScucess(res, file, item)}"
                    :before-upload="beforeAvatarUpload">
                    <img width="200px" height="200px" v-if="item.image_url" :src="baseImgPath + item.image_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </div>
            </el-card>
            <el-button type="primary" icon="el-icon-circle-plus" @click="addRoom()">添加房型</el-button>
          </el-form>
          <div style="text-align: center;">
            <el-button type="primary" @click="editHotel()">确定</el-button>
          </div>
        </el-dialog>
      </el-tabs>
    </div>
    <el-dialog title="评论列表" :visible.sync="isShowComment" width="800px">
      <el-table :data="comment" border>
        <el-table-column property="user_name" label="评论人" width="80"></el-table-column>
        <el-table-column property="score" label="打分" width="60"></el-table-column>
        <el-table-column property="praise_num" label="被赞数" width="80"></el-table-column>
        <el-table-column property="" label="评论状态" width="80">
          <template slot-scope="scope">
            <div>
              {{scope.row.status?'可见':'冻结'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column property="comment_time" label="评论时间" width="100"></el-table-column>
        <el-table-column property="describe" label="评论内容"></el-table-column>
        <el-table-column property="" label="操作" width="220" align="center" header-align="center">
          <template slot-scope="scope">
            <div>
              <el-button v-if="scope.row.status" type="danger" size="mini" @click="changeStatus(scope.row, false)">冻结</el-button>
              <el-button v-if="!scope.row.status" size="mini" @click="changeStatus(scope.row, true)">解冻</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {
    mapActions,
    mapState
  } from 'vuex'
  import {
    getHotelList,
    addHotel,
    editHotel,
    delHotel,
    getProvinceList,
    getCityList
  } from '../../api/getData'
  import _ from 'lodash';
  import {baseUrl, baseImgPath} from '@/config/env.js'
  export default {
    data() {
      return {
        isShowDetails: false,
        activeType: '酒店列表',
        isShowEditDetails: false,
        hotelList: [],
        provinceList: [],
        cityList: [],
        fileList: [],
        form: {
          comment:[],
          sub_room:[{
            area: '',
            breakfast: false,
            hold_num: '',
            image_url: '',
            price: '',
            room_name: '',
            surplus_num: '',
            wifi: false,
            window: false,
          }]
        },
        comment: [],
        isShowComment: false,
        origin: '',
        baseUrl: baseUrl,
        baseImgPath: baseImgPath,
        iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'],
        rules: {}
      }
    },
    mounted() {
      this.getHotelList();
      this.getProvinceList();
      this.origin = window.location.origin + '/';
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods: {
      ...mapActions(['getAdminData']),
      async getProvinceList() {
        const res = await getProvinceList();
        this.provinceList = res.data;
      },
      changeProvince() {
        this.form.city = '';
        this.getCityList();
      },
      async getCityList() {
        const res = await getCityList(this.form.province);
        this.cityList = res.data;
      },
      showCommentList(row) {
        this.isShowComment = true;
        this.comment = row.comment;
        this.form.id = row.id;
      },
      async changeStatus(row, status) {
        row.status = status;
        const res = await editHotel(this.form.id, {comment:this.comment});
        if ( res.status===1 ) {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          this.isShowEditDetails = false;
          this.getHotelList();
        } else {
          this.$message({
            type: 'error',
            message: `${res.message}`
          });
        }
      },
      changeCity() {
        this.$forceUpdate();
      },
      handleRemove(file, fileList, row) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handlRoomScucess(res, file, row) {
        
				if (res.status == 1) {
          _.forEach(this.form.sub_room, (item, index) => {
            if (item.room_name === row.room_name) {
              this.$forceUpdate();
              this.form.sub_room[index].image_url = res.image_path;
            }
          });
          console.log(this.form)
				}else{
					this.$message.error('上传图片失败！');
				}
      },
      beforeAvatarUpload(file) {
				const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isRightType) {
					this.$message.error('上传图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传图片大小不能超过 2MB!');
				}
				return isRightType && isLt2M;
			},
      handlHotelAvatarScucess(res, file) {
        console.log(res.status)
				if (res.status == 1) {
          this.$forceUpdate();
					this.form.image_url = res.image_path;
				}else{
					this.$message.error('上传图片失败！');
				}
      },
      async editHotel() {
        const res = await editHotel(this.form.id, this.form);
        if ( res.status===1 ) {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          this.isShowEditDetails = false;
          this.getHotelList();
        } else {
          this.$message({
            type: 'error',
            message: `${res.message}`
          });
        }
      },
      async delHotel(row) {
        this.$confirm('是否确认删除？', '提示', { type: 'warning' }).then(async () => {
          const res = await delHotel(row.id);
          if ( res.status===1 ) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getHotelList();
          } else {
            this.$message({
              type: 'error',
              message: `${res.message}`
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      async getHotelList() {
        const res = await getHotelList();
        this.hotelList = res.data;
      },
      sortChange(column, prop, order) {
        console.log( column, prop, order);
      },
      changeType() {
        this.form = {
          sub_room:[]
        };
      },
      changeDetails(row, mark) {
        this.isShowDetails = mark;
        if (mark) {
          this.form = row;
        }
      },
      changeEdit(row, mark) {
        this.isShowEditDetails = mark;
        if (mark) {
          this.form = row;
        }
      },
      addRoom() {
        this.form.sub_room.push({
          area: '',
          breakfast: false,
          hold_num: '',
          image_url: '',
          price: '',
          room_name: '',
          surplus_num: '',
          wifi: false,
          window: false,
        });
      },
      delRoom(room) {
        this.$confirm('是否确认删除？', '提示', { type: 'warning' }).then(() => {
          _.remove(this.form.sub_room, (item) => { 
            return item.room_name == room.room_name; 
          });
          this.$forceUpdate();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      async addHotel() {
        const res = await addHotel(this.form);
        if ( res.status===1 ) {
          this.$message({
            type: 'success',
            message: '添加成功'
          });
          this.activeType = '酒店列表';
          this.getHotelList();
        } else {
          this.$message({
            type: 'error',
            message: `${res.message}`
          });
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
  .margin-b-20{
    margin-bottom: 20px;
  }
  .width-300{
    width: 300px;
  }
</style>
