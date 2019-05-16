<template>
  <div>
    <div class="headerWrapper" style="height: 80px;">
      <header class="header" style="height: 80px;background-color: #13d1be;">
        <div class="logo">
          <img src="../assets/images/logo.png" style="height:80px;margin: 0 0 0 30px;user-select: none;" />
        </div>
        <span style="display:inline-block;margin-top:20px;">当前城市：{{province}}</span>
        <el-button type="text" style="color:#fff;margin-top:20px;" @click="changeProvinceStatus(true)">[切换城市]
        </el-button>
        <div v-if="!adminInfo.admin" class="user">
          <el-button style="margin-right:20px;" type="primary" plain>请登录</el-button>
        </div>
        <div v-if="adminInfo.admin" class="user" :class="{ active: isInfoCardShow }">
          <img v-if="adminInfo.avatar" @click="toggleUserCard" :src="baseImgPath + adminInfo.avatar" class="avatars">
          <div v-else class="userImg" @click="toggleUserCard"></div>
        </div>
        <div class="box" v-if="isInfoCardShow">
          <p>我的个人信息</p>
          <ul>
            <li>您好，<span>{{userData.user_name}}</span></li>
            <li>所属角色：<span>{{userData.admin}}</span></li>
          </ul>
          <p class="logout" @click="logOut">退出</p>
        </div>
        <el-dialog title="提示" :visible.sync="isShowProvince" :before-close="beforeClose" width="500px" center>
          <span class="">请选择当前所在省份：</span>
          <el-select v-model="province" placeholder="请选择">
            <el-option v-for="item in provinceList" :key="item.name" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="changeProvinceStatus(false)">取 消</el-button>
            <el-button type="primary" @click="changeProvince()">确 定</el-button>
          </span>
        </el-dialog>
      </header>
    </div>
    <nuxt />
    <footer>
      <div class="check-common-footer">
        <div class="footer-container">
          声明
        </div>
        <div class="footer-divide"></div>
        <div class="footer-certificate">
          本网站为毕业设计所做，不可商用
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  import {
    login,
    register,
    singout,
    getAdminInfo,
    getProvinceList
  } from '../api/getData'
  import {
    baseUrl,
    baseImgPath
  } from '@/config/env'
  import {
    mapActions,
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        baseUrl: baseUrl,
        baseImgPath: baseImgPath,
        isInfoCardShow: false,
        userData: {},
        provinceList: [],
        province: '',
        isShowProvince: false
      }
    },
    async mounted() {
      this.province = localStorage.getItem('province') || '';
      this.$store.dispatch('setProvince', this.province);
      await this.$store.dispatch('getAdminData');
      this.userData = this.adminInfo;
      this.getProvinceList();
      if (!this.provinceInfo) {
        this.isShowProvince = true;
      }
    },
    computed: {
      ...mapState(['adminInfo', 'provinceInfo']),
    },
    methods: {
      ...mapActions(['getAdminData']),
      async getProvinceList() {
        const res = await getProvinceList();
        this.provinceList = res.data;
      },
      changeProvinceStatus(status) {
        if (!status) {
          if (this.province) {
            this.isShowProvince = status;
          }
        } else {
          this.isShowProvince = status;
        }
      },
      changeProvince() {
        this.$store.dispatch('setProvince', this.province);
        if (!this.province) {
          this.$alert(' 请至少选择省份！', '提示');
          return false;
        }
        this.changeProvinceStatus(false);
      },
      beforeClose(done) {
        if (!this.province) {
          return false;
        }
        done();
      },
      toggleUserCard() {
        this.isInfoCardShow = !this.isInfoCardShow;
        this.$store.dispatch('getAdminData');
        console.log(this.adminInfo);
      },
      //退出登录
      async logOut() {
        const res = await singout();
        this.$store.dispatch('getAdminData');
        if (res.status === 1) {
          this.$router.push('login');
        }
      }
    }
  }

</script>

<style lang="less">
  @import '../style/common.less';
  @import '../style/mixin.less';

.check-common-footer {
    width: 100%;
    background: #363636;
    overflow: hidden;
    color: #fff;
}
.check-common-footer .footer-container{
    margin: 30px auto 0;
    text-align: center;
}
.check-common-footer .footer-contact{
    margin: 20px auto 0;
    color: #909090;
}
.check-common-footer .footer-divide {
    width: 100%;
    height: 1px;
    background:#565656;
    margin: 20px 0;
}
.check-common-footer .footer-certificate{
	text-align: center;
    margin: 0 auto;
    margin-bottom: 20px;
}
</style>
