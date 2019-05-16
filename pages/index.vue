<template>
  <section class="container">
    <div>
      <!-- <logo />
      <h1 class="title">
        tourism
      </h1>
      <h2 class="subtitle">
        My smashing Nuxt.js project
      </h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green"
        >Documentation</a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >GitHub</a>
      </div> -->
      <el-carousel height="400px">
        <el-carousel-item v-for="item in banner" :key="item.url">
          <img height="400px" width="100%" :src="item.url" />{{item.url}}
        </el-carousel-item>
      </el-carousel>
      <div style="padding:20px;">
        <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span>推荐酒店</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import {
    mapActions,
    mapState
  } from 'vuex'

export default {
  components: {
    Logo
  },
  data() {
    return {
      banner:[{
        url: require('../assets/images/banner1.jpg')
      },{
        url: require('../assets/images/banner2.jpg')
      }]
    }
  },
  async mounted() {
  },
  computed: {
    ...mapState(['adminInfo']),
  },
  methods: {
    ...mapActions(['getAdminData'])
  }
}
</script>

<style lang="less">
@import '../style/common.less';
@import '../style/mixin.less';
// .container {
//   margin: 0 auto;
//   min-height: 100vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   text-align: center;
// }

// .title {
//   font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
//     'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//   display: block;
//   font-weight: 300;
//   font-size: 100px;
//   color: #35495e;
//   letter-spacing: 1px;
// }

// .subtitle {
//   font-weight: 300;
//   font-size: 42px;
//   color: #526488;
//   word-spacing: 5px;
//   padding-bottom: 15px;
// }

// .links {
//   padding-top: 15px;
// }
</style>
