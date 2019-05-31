<template>
  <section class="container">
    <div style="padding: 20px 40px;">
      <el-button type="primary" @click="$router.push('/');">返回首页</el-button>
      <div>
        <h1>{{travelObj.name}}</h1>
        <div>{{travelObj.address}}</div>
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
            <span>景点信息</span>
          </div>
          <ul>
            <li style="margin-bottom:20px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
              <span style="font-weight: bold;">价格：</span>
              <span class="color:red">￥{{travelObj.ticket_cost}}元</span>
            </li>
            <li style="margin-bottom:20px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
              <span style="font-weight: bold;">景点地址：</span>
              <span>{{travelObj.city}}市{{travelObj.address}}</span>
            </li>
            <li style="margin-bottom:20px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
              <span style="font-weight: bold;">联系方式：</span>
              <span>{{travelObj.telephone}}</span>
            </li>
            <li style="margin-bottom:20px; padding-bottom: 20px;">
              <span style="font-weight: bold;">景点简介：</span>
              <span>{{travelObj.introduce}}</span>
            </li>
          </ul>
        </el-card>
      </div>
      <div style="margin: 20px 0;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户评论({{travelObj.comment?travelObj.comment.length:0}})</span>
            <span style="float:right;">整体评分：<span style="color: red; font-size: 20px">{{travelObj.score}}</span>/5分 </span>
          </div>
          <ul v-if="travelObj.comment&&travelObj.comment.length>0">
            <li v-for="item in travelObj.comment" :key="item.user_name" style="margin-bottom:20px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
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
    getTravelDel,
    bookTravel,
    isCanTravelComment,
    addTravelComment
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
        travelId: '',
        travelObj: {},
        currentImg: '',
        imgList: [],
        comment: '',
        score: 0,
        isCanComment: false
      }
    },
    async mounted() {
      this.travelId = this.$route.query.id;
      this.getTravelDel();
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
        const res = await isCanTravelComment(this.travelId);
        this.isCanComment = res.data;
      },
      async addComment() {
        if (this.score < 1) {
          this.$alert('请给景点评分', '提示');
          return false;
        }
        let obj = {
          photo_url: this.adminInfo.avatar,
          user_name: this.adminInfo.user_name,
          user_id: this.adminInfo.id,
          score: this.score,
          describe: this.comment
        };
        const res = await addTravelComment(this.travelId, obj);
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
      },
      async getTravelDel() {
        const res = await getTravelDel(this.travelId);
        if (res.status === 1) {
          this.travelObj = res.data;
          console.log(this.travelObj)
          this.imgList = [];
          this.currentImg = this.baseImgPath + this.travelObj.image_url;
          this.imgList.push({
            url: this.travelObj.image_url
          })
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
