<template>
  <div class="main-container">

    <container-title :title-text="'修改密码'"/>

    <div class="main-container-content">
      <div class="login-form-container">
        <el-form
          v-loading="loading"
          ref="form"
          :rules="rules"
          :model="form"
          status-icon
          label-width="100px">
          <el-form-item prop="oldPassword" label="旧密码">
            <el-input
              v-model="form.oldPassword"
              type="password"
              placeholder="旧密码"
              auto-complete="off"/>
          </el-form-item>
          <el-form-item prop="newPassword" label="新密码">
            <el-input
              v-model="form.newPassword"
              type="password"
              placeholder="新密码"
              auto-complete="off"/>
          </el-form-item>
          <el-form-item prop="newPassword2" label="确认新密码">
            <el-input
              v-model="form.newPassword2"
              type="password"
              placeholder="确认新密码"
              auto-complete="off"/>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="btn-login"
              @click="modifyPassOpretion()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
import { modifyPass } from './request.js'
import ContainerTitle from '@/common/components/ContainerTitle.vue'
import md5 from 'md5'

export default {
  components: { ContainerTitle },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else {
        if (this.form.newPassword2 !== '') {
          this.$refs.form.validateField('newPassword2')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认密码密码不能为空'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }

    return {
      form: {
        newPassword: '',
        oldPassword: '',
        newPassword2: ''
      },
      rules: {
        oldPassword: [
          { trigger: 'blur', required: true, message: '密码不能为空' }
        ],
        newPassword: [
          { validator: validatePass, required: true }
        ],
        newPassword2: [
          { validator: validatePass2, required: true }
        ]
      },
      loading: false
    }
  },
  methods: {
    modifyPassOpretion() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            oldPassword: md5(this.form.oldPassword),
            newPassword: md5(this.form.newPassword)
          }
          modifyPass(params)
            .then(res => {
              this.loading = false
              if (res.data.status === 1) {
                this.form.oldPassword = ''
                this.form.newPassword = ''
                this.form.newPassword2 = ''
                this.$router.push('/login')
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(res => {
              this.loading = false
              this.$message.error(res)
            })
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
    .login-container{
        position: relative;
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
        }
    }
</style>
