<template>
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
            <el-menu-item
                v-if="authShow"
                index="1" @click="routLink(1)">
                <i class="el-icon-menu"></i>
                <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="2" @click="routLink(2)">
                <i class="el-icon-menu"></i>
                <span>标注中心</span>
            </el-menu-item>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>设置</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="3-1" @click="routLink(3)">修改密码</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
    </el-menu>

</template>

<script>
import {get} from '@/common/net/serviceUtil.js'

export default {
  data () {
    return {
      authShow: false
    }
  },
  mounted () {
    this.getAuth()
  },
  methods: {
    routLink (val) {
      switch (val) {
        case 1:
          this.$router.push('/user')
          break
        case 2:
          this.$router.push('/tag')
          break
        case 3:
          this.$router.push('/modifypass')
          break
      }
    },
    getAuth () {
      get('user/nav')
        .then(res => {
          if (res.data.status === 1) {
            if (res.data.data.userType === 2) {
              this.authShow = true
            } else {
              this.authShow = false
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.data.msg)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
   .el-menu-vertical-demo{
       position: fixed;
       left: 0;
       top: 54px;
       width: 160px;
       height: 100%;
       z-index: 100;
   }
   .el-submenu .el-menu-item{
       min-width: auto;
   }
</style>
