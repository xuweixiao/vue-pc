<template>
  <div v-loading="loading" class="login-container">
    <div class="footer"/>
    <div class="content">
      <div class="login-form-container">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          status-icon
          label-width="0">
          <el-form-item>
            <h2 class="title">通用平台</h2>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              type="text"
              placeholder="用户名"
              auto-complete="off"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              auto-complete="off"/>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="btn-login"
              @click="loginOpretion()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer">Copyright@一座岛</div>
  </div>
</template>

<script>
// import {post} from '@/common/net/serviceUtil.js'
// import md5 from 'md5'

export default {
  data() {
    return {
      form: {
        password: '',
        username: ''
      },
      loading: false,
      rules: {
        password: [
          { trigger: 'blur', required: true, message: '密码不能为空' }
        ],
        username: [
          { trigger: 'blur', required: true, message: '用户名不能为空' }
        ]
      }
    }
  },
  methods: {
    loginOpretion() {
      this.$router.replace('/tag')
      // this.$refs.form.validate(valid => {
      //   if (valid) {
      //     this.loading = true
      //     let params = {
      //       username: this.form.username,
      //       password: md5(this.form.password)
      //     }
      //     post('/user/login', params)
      //       .then(res => {
      //         this.loading = false
      //         if (res.data.status === -1) {
      //           this.$message.error(res.data.msg)
      //         } else {
      //           this.$router.replace('/tag')
      //         }
      //       })
      //       .catch(res => {
      //         this.loading = false
      //         this.$message.error(res.data.msg)
      //       })
      //   }
      // })
    }
  }

}
</script>

<style lang="scss" scoped>
    .login-container{
        position: fixed;
        left: 0;
        width: 100%;
        padding-top: 110px;

        .title{
            text-align: center;
        }

        .login-form-container{
            width: 375px;
            margin: 0 auto;
        }

        .btn-login{
            width: 100%;
            margin-top: 25px;
        }

        .footer{
            text-align: center;
            opacity: 0.5;
            color: #000;
            position: fixed;
            bottom: 20px;
            width: 100%;
            font-size: 12px;
        }
    }
</style>
