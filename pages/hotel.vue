<template>
  <section class="container">
    <div style="padding: 20px 40px;">
      <el-button type="primary" @click="$router.push('/');">返回首页</el-button>
      <div>
        <h1>{{hotelObj.name}}</h1>
        <div>{{hotelObj.address}}</div>
      </div>
      <div>
        <!-- <img width="760px" height="280px" style="border-radius: 4px;" :src="currentImg"> -->
        <el-carousel :interval="40000000" height="280px" @change="changeImg">
          <el-carousel-item v-for="item in imgList" :key="item.url">
            <img height="280px" width="100%" style="border-radius: 4px;" :src="baseImgPath + item.url">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div style="margin: 20px 0;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>房间信息</span>
          </div>
          <ul v-for="item in hotelObj.sub_room" :key="item.room_id">
            <li style="margin-bottom:20px; border-bottom: 1px solid #ccc; padding-bottom: 20px; position: relative; min-height:120px;padding-left:140px;">
              <img width="120px" height="80px" :src="baseImgPath + item.image_url" style="vertical-align: top; position: absolute; left:0px;">
              <div style="display:inline-block;">
                <span style="font-weight: bold;">房间名称：</span>
                <span>{{item.room_name}}</span>
              </div><br />
              <div style="display:inline-block;">
                <span>上网:</span><span>{{item.wifi?'是':'否'}}</span>
                <span>窗户:</span><span>{{item.window?'是':'否'}}</span>
                <span>含早餐:</span><span>{{item.breakfast?'是':'否'}}</span>
                <span>居住人数:</span><span>{{item.hold_num}}人</span>
                <span>面积:</span><span>{{item.area}}平方米</span>
              </div>
              <div style="position: absolute; right:0px;color:red;">
                <span>￥{{item.price}}元</span>
                <el-button type="primary" @click="book(item.room_id,item.surplus_num)">预订</el-button><br/>
                <span>还剩{{item.surplus_num}}间</span>
              </div>
            </li>
          </ul>
        </el-card>
      </div>
      <div style="margin: 20px 0;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>酒店信息</span>
          </div>
          <ul>
            <li style="margin-bottom:20px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
              <span style="font-weight: bold;">酒店地址：</span>
              <span>{{hotelObj.city}}市{{hotelObj.address}}</span>
            </li>
            <li style="margin-bottom:20px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
              <span style="font-weight: bold;">联系方式：</span>
              <span>{{hotelObj.telephone}}</span>
            </li>
            <li style="margin-bottom:20px; padding-bottom: 20px;">
              <span style="font-weight: bold;">酒店简介：</span>
              <span>{{hotelObj.introduce}}</span>
            </li>
          </ul>
        </el-card>
      </div>
      <div style="margin: 20px 0;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户评论({{hotelObj.comment?hotelObj.comment.length:0}})</span>
            <span style="float:right;">整体评分：<span style="color: red; font-size: 20px">{{hotelObj.score}}</span>/5分 </span>
          </div>
          <ul v-if="hotelObj.comment&&hotelObj.comment.length>0">
            <li v-for="item in hotelObj.comment" :key="item.user_name" style="margin-bottom:20px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
              <img style="width:60px; height:60px; border-radius:50%;" :src="baseImgPath + item.photo_url">
              <div style="display:inline-block; vertical-align: top;">
                <span style="display:inline-block; margin-bottom: 10px;">{{item.user_name}}</span>
                <el-rate
                  v-model="item.score"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
              </div>
              <div>
                {{item.describe}}
              </div>
            </li>
          </ul>
          <div v-else>
            暂无评论
          </div>
          <el-row>
            <el-col :span="12">
              <el-input
                type="textarea"
                :disabled="isCanComment"
                :rows="6"
                placeholder="请输入内容"
                v-model="comment">
              </el-input>
              <el-button type="primary" :disabled="isCanComment" @click="addComment" style="margin-top:20px;">提交评论</el-button>
            </el-col>
            <el-col :span="12" style="text-align: center;">
              <span>评分：</span>
              <el-rate
                style="display:inline-block;"
                v-model="score"
                show-score
                 :disabled="isCanComment"
                text-color="#ff9900">
              </el-rate>
              <!-- <el-button type="primary" :disabled="isCanComment" @click="addComment" style="margin-top:20px;">提交评分</el-button> -->
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
  </section>
</template>

<script>
  import Logo from '~/components/Logo.vue'
  import {
    getHotelList,
    getTravelList,
    getProvinceList,
    getCityList,
    getHotelDel,
    bookHotel,
    isCanComment,
    addHotelComment
  } from '../api/getData'
  import {
    mapActions,
    mapState
  } from 'vuex'
  import {
    baseUrl,
    baseImgPath
  } from '@/config/env.js'

  export default {
    data() {
      return {
        baseImgPath: baseImgPath,
        baseUrl: baseUrl,
        hotelId: '',
        hotelObj: {},
        currentImg: '',
        comment: '',
        score: 0,
        imgList: [],
        isCanComment: false
      }
    },
    async mounted() {
      this.hotelId = this.$route.query.id;
      this.getHotelDel();
      this.getCommentStatus();
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods: {
      ...mapActions(['getAdminData']),
      changeImg(index) {
        this.currentImg = this.baseImgPath + this.imgList[index].url;
      },
      async getCommentStatus() {
        const res = await isCanComment(this.hotelId);
        this.isCanComment = res.data;
      },
      async addComment() {
        if (this.score < 1) {
          this.$alert('请给酒店评分', '提示');
          return false;
        }
        let obj = {
          photo_url: this.adminInfo.avatar,
          user_name: this.adminInfo.user_name,
          user_id: this.adminInfo.id,
          score: this.score,
          describe: this.comment
        };
        const res = await addHotelComment(this.hotelId, obj);
        if (res.status === 1) {
          this.$message({
            type: 'success',
            message: '评论成功'
          });
        } else {
          this.$message({
            type: 'error',
            message: `${res.message}`
          });
        }
        console.log(obj);
      },
      async book(roomId,surplus_num) {
        if (surplus_num<=0) {
          this.$alert('该房间已无，请预定其他房间', '提示');
          return false;
        }
        this.$confirm('是否确认预订该房间？', '提示', { type: 'warning' }).then(async () => {
          const res = await bookHotel(this.hotelId, {room_id: roomId,surplus_num:surplus_num-1});
          if (res.status === 1) {
            this.$message({
              type: 'success',
              message: '预订成功'
            });
            this.getHotelDel();
          } else {
            this.$message({
              type: 'error',
              message: `${res.message}`
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消预订'
          });
        });
      },
      async getHotelDel() {
        const res = await getHotelDel(this.hotelId);
        if (res.status === 1) {
          this.hotelObj = res.data;
          console.log(this.hotelObj)
          this.imgList = [];
          this.currentImg = this.baseImgPath + this.hotelObj.image_url;
          this.imgList.push({
            url: this.hotelObj.image_url
          })
          this.hotelObj.comment.forEach(item => {
            if (item.user_id == this.adminInfo.id) {
              this.score = item.score;
            }
          });
          this.hotelObj.sub_room.forEach(item => {
            if (item.image_url) {
              this.imgList.push({
                url: item.image_url
              })
            }
          });
        }
      },
    }
  }

</script>

<style lang="less">
  @import '../style/common.less';
  @import '../style/mixin.less';

  .green-c {
    color: #13d1be;
  }

  .green-b {
    background: #13d1be;
    border: #13d1be;
  }

</style>
