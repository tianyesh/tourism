<template>
  <div>
    <nuxt />
  </div>
</template>


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
}

.box ul {
  margin: 10px 0 10px 0;
  padding: 0 0 0 10px;
}

.box ul li {
  list-style: none;
  line-height: 24px;
}
</style>
