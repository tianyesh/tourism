<template>
  <div>
    <div class="headerWrapper" style="height: 80px;">
        <header class="header" style="height: 80px;background-color: #13d1be;">
            <div class="logo">
                <img src="../assets/images/logo.png" style="height:80px;margin: 0 0 0 30px;user-select: none;" />
            </div>
            <div class="user" :class="{ active: isInfoCardShow }">
                <div class="userImg" @click="toggleUserCard">
                </div>
            </div>
            <div class="box" v-if="isInfoCardShow">
                <p>我的个人信息</p>
                <ul>
                    <li>您好，<span>{{userData.user_name}}</span></li>
                    <li>所属角色：<span>{{userData.admin}}</span></li>
                </ul>
                <p class="logout" @click="logOut">退出</p>
            </div>
        </header>
    </div>
    <nuxt />
  </div>
</template>

<script>
  import {
    mapActions,
    mapState
  } from 'vuex'
  import {
    singout
  } from '../api/getData'
  export default {
    middleware: 'auth',
    data() {
      return {
        isInfoCardShow: false,
        userData: {}
      }
    },
    async mounted() {
      await this.$store.dispatch('getAdminData');
      this.userData = this.adminInfo;
      if(!this.userData.id){
        this.$router.push('login');
      }
    },
    computed: {
      ...mapState(['adminInfo']),
    },
    methods: {
      ...mapActions(['getAdminData']),
      toggleUserCard() {
        this.isInfoCardShow = !this.isInfoCardShow;
        this.$store.dispatch('getAdminData');
        console.log(this.adminInfo);
      },
      //退出登录
      async logOut() {
        const res = await singout();
        this.$store.dispatch('getAdminData');
        if(res.status === 1){
          this.$router.push('login');
        }
      }
    }
  }

</script>

<style lang="less">
@import '../style/common.less';
@import '../style/mixin.less';
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
#__nuxt,#__layout{
  height: 100%;
}
#__layout>div{
  height: 100%;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}


// header
.header .user {
  height: 80px;
}

.logout {
  text-align: center;
  cursor: pointer;
}

.box {
  width: 260px;
  z-index: 999;
  position: absolute;
  right: 0px;
  top: 80px;
  background: #fff;
  -moz-box-shadow: -2px 4px 10px #ccc; /* 老的 Firefox */
  box-shadow: -2px 4px 10px #ccc;
}

.box p {
  line-height: 36px;
  padding-left: 10px;
  background-color: #3b8070;
  color: #fff;
}

.box ul {
  margin: 10px 0 10px 0;
  padding: 0 0 0 10px;
}

.box ul li {
  list-style: none;
  line-height: 24px;
}
.logo {
    float: left;
    height: 80px;
    padding-right: 30px;
}

.user {
    display: flex;
    width: 80px;
    height: 80px;
    float: right;
    color: #fff;
    justify-content: center;
    align-items: center;
}

.userImg {
    display: flex;
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: url(../assets/images/default.jpg) no-repeat center;
    background-size: contain;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
