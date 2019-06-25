<template>
    <header>
        <div class="pull-left logo-container poiner">
             <img
                class="poiner exit logo"
                src="@/assets/img/logo.jpg" >
        </div>
        <div class="top-intro-container">
            <div class="pull-left">测试</div>
            <div class="pull-right">
                 <img
                    @click="logoutOpration"
                    class="poiner exit logout"
                    src="@/assets/img/logout.png" >
            </div>
        </div>
    </header>
</template>

<script>
import {get} from '@/common/net/serviceUtil'
export default {
  methods: {
    logoutOpration () {
      get('user/logout')
        .then(res => {
          this.$router.replace('/login')
        })
        .catch(res => {

        })
    }
  }
}
</script>

<style lang="scss" scoped>
    header{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        height: 54px;
        display: block;
        z-index: 9;

        .pull-left{
            float: left;
        }
        .poiner{
            cursor: pointer;
        }
        .logo-container{
            height: 54px;
            width: 160px;
            background-color:#34363e;
            text-align: center;
            padding: 10px;
            box-sizing: border-box;
        }
        .top-intro-container{
            display: block;
            height: 54px;
            background-color: #fff;
            padding: 0 24px 0 180px;
            line-height: 54px;
            color: #fff;
            box-sizing: content-box;
        }
        .pull-right{
            float: right;
        }
        .logout{
            width: 20px;
        }
        .logo{
            width: 75%;
        }
    }
</style>
