<template>
  <section class="container">
    <div style="padding: 20px 40px;">
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
            <span>用户评论</span>
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
    getHotelDel
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
        imgList: []
      }
    },
    async mounted() {
      this.hotelId = this.$route.query.id;
      console.log(this.$route);
      this.getHotelDel();
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods: {
      ...mapActions(['getAdminData']),
      changeImg(index) {
        this.currentImg = this.baseImgPath + this.imgList[index].url;
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
