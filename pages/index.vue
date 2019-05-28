<template>
  <section class="container">
    <div>
      <el-carousel height="400px">
        <el-carousel-item v-for="item in banner" :key="item.url">
          <img height="400px" width="100%" :src="item.url" />{{item.url}}
        </el-carousel-item>
      </el-carousel>
      <div style="padding:20px;">
        <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span>推荐酒店</span>
            <span style="margin-left:100px;cursor: pointer;" :class="{'green-c': orderHotelType==''}" @click="changeHotelOrder('')">默认排序</span>
            <span style="margin-left:20px;cursor: pointer;" :class="{'green-c': orderHotelType=='1'}" @click="changeHotelOrder('1')">价格升序</span>
            <span style="margin-left:20px;cursor: pointer;" :class="{'green-c': orderHotelType=='2'}" @click="changeHotelOrder('2')">价格降序</span>
            <span style="margin-left:20px;cursor: pointer;" :class="{'green-c': orderHotelType=='3'}" @click="changeHotelOrder('3')">评分</span>
          </div>
          <div v-for="item in hotelList" :key="item.id" class="text item">
            <ul>
              <li>
                <img width="200px" height="120px" style="border-radius: 4px;" :src="baseImgPath + item.image_url">
                <div style="display:inline-block;width:300px;height:120px;vertical-align: top;">
                  <div>
                    <el-button type="text" class="green-c" @click="toUrl('hotel', item.id)">{{item.name}}</el-button>
                  </div>
                  <div>
                    {{item.city}}市{{item.address}}
                  </div>
                  <div style="margin-top:20px;">
                    电话：{{item.telephone}}
                  </div>
                </div>
                <div style="display:inline-block;width:200px;height:120px;vertical-align: top; text-align: center;">
                  <div style="font-size: 32px; color: red;margin-top:20px;">评分：{{item.score}} 分</div>
                  <el-button type="text" class="green-c" @click="toUrl('hotel', item.id)">查看评论</el-button>
                </div>
                <div style="display:inline-block;width:200px;height:120px;vertical-align: top; text-align: center;">
                  <div style="font-size: 32px; color: red;margin-top:20px;">￥{{item.minPrice}} 元</div>
                  <el-button type="primary" size="mini" class="green-b" style="margin-top:10px" @click="toUrl('hotel', item.id)">查看详情</el-button>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
        <el-card class="box-card" shadow="always" style="margin-top:20px">
          <div slot="header" class="clearfix">
            <span>推荐景点</span>
            <span style="margin-left:100px;cursor: pointer;" :class="{'green-c': orderTravelType==''}" @click="changeTravelOrder('')">默认排序</span>
            <span style="margin-left:20px;cursor: pointer;" :class="{'green-c': orderTravelType=='1'}" @click="changeTravelOrder('1')">价格升序</span>
            <span style="margin-left:20px;cursor: pointer;" :class="{'green-c': orderTravelType=='2'}" @click="changeTravelOrder('2')">价格降序</span>
            <span style="margin-left:20px;cursor: pointer;" :class="{'green-c': orderTravelType=='3'}" @click="changeTravelOrder('3')">评分</span>
          </div>
          <div v-for="item in travelList" :key="item.id" class="text item">
            <ul>
              <li>
                <img width="200px" height="120px" style="border-radius: 4px;" :src="baseImgPath + item.image_url">
                <div style="display:inline-block;width:300px;height:120px;vertical-align: top;">
                  <div>
                    <el-button type="text" class="green-c" @click="toUrl('travel', item.id)">{{item.name}}</el-button>
                  </div>
                  <div>
                    {{item.city}}市{{item.address}}
                  </div>
                  <div style="margin-top:20px;">
                    电话：{{item.telephone}}
                  </div>
                </div>
                <div style="display:inline-block;width:200px;height:120px;vertical-align: top; text-align: center;">
                  <div style="font-size: 32px; color: red;margin-top:20px;">评分：{{item.score}} 分</div>
                  <el-button type="text" class="green-c" @click="toUrl('travel', item.id)">查看评论</el-button>
                </div>
                <div style="display:inline-block;width:200px;height:120px;vertical-align: top; text-align: center;">
                  <div style="font-size: 32px; color: red;margin-top:20px;">￥{{item.ticket_cost}}元</div>
                  <el-button type="primary" size="mini" class="green-b" style="margin-top:10px" @click="toUrl('travel', item.id)">查看详情</el-button>
                </div>
              </li>
            </ul>
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
    getCityList
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
    components: {
      Logo
    },
    data() {
      return {
        banner: [{
          url: require('../assets/images/banner1.jpg')
        }, {
          url: require('../assets/images/banner2.jpg')
        }],
        hotelList: [],
        travelList: [],
        offset: 0,
        limit: 4,
        baseImgPath: baseImgPath,
        baseUrl: baseUrl,
        orderHotelType: '', // 1：价格升序 2：价格降序 3：评分
        orderTravelType: ''
      }
    },
    async mounted() {
      this.getHotelList();
      this.getTravelList();
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods: {
      ...mapActions(['getAdminData']),
      toUrl(type, id, hash) {
        this.$router.push({
          path: type,
          name: type,
          query: {
            id
          }
        });
      },
      getMinPrice(list, key) {
        let price = list[0][key];
        list.forEach(item => {
          if (price > item[key]){
            price = item[key];
          }
        });
        return price;
      },
      async getHotelList() {
        const res = await getHotelList({
          offset: this.offset,
          limit: this.limit
        });
        this.hotelList = res.data;
        this.hotelList.forEach(item=> {
          item.minPrice = this.getMinPrice(item.sub_room, 'price');
        })
        console.log(this.hotelList)
      },
      async getTravelList() {
        const res = await getTravelList({
          offset: this.offset,
          limit: this.limit
        });
        this.travelList = res.data;
      },
      changeHotelOrder(type) {
        if (this.orderHotelType != type) {
          this.orderHotelType = type;
          console.log(this.orderHotelType);
        }
      },
      changeTravelOrder(type) {
        if (this.orderTravelType != type) {
          this.orderTravelType = type;
          console.log(this.orderTravelType);
        }
      }
    }
  }

</script>

<style lang="less">
  @import '../style/common.less';
  @import '../style/mixin.less';
  .green-c{
    color: #13d1be;
  }
  .green-b{
    background: #13d1be;
    border: #13d1be;
  }
</style>
