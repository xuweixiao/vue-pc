<template>
  <div v-loading="loading" class="main-container">

    <container-title :title-text="'用户管理'">
      <template>
        <el-button type="primary" @click="addUserOperation">添加用户</el-button>
      </template>
    </container-title>

    <div class="main-container-content">
      <el-form
        ref="form"
        :model="form"
        :inline="true"
        label-width="80px">
        <el-form-item label="用户名称">
          <el-input
            v-model="form.username"
            clearable
            suffix-icon="el-icon-search"
            @keyup.enter.native="getUserList"/>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="userList"
        border>
        <el-table-column
          :show-overflow-tooltip="true"
          label="用户ID"
          prop="id"
          align="center"
          fixed/>
        <el-table-column
          :show-overflow-tooltip="true"
          label="用户名称"
          prop="username"
          align="center"
          fixed/>
        <el-table-column
          label="操作"
          align="center"
          fixed>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="deleteUserOperation(scope.row.id)">删除</el-button>
            <el-button
              v-if="false"
              type="text"
              size="small"
              @click="editUser(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="listTotal !=0"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="listTotal"
        background
        class="page-container"
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"/>
    </div>

    <el-dialog
      :visible.sync="dialogFormVisible"
      title="添加用户"
      width="400px">
      <el-form
        ref="addUserForm"
        :rules="addUserRules"
        :model="addUserForm"
        label-width="80px">
        <el-form-item
          label="用户名称"
          prop="username">
          <el-input
            v-model="addUserForm.username"
            placeholder="用户名"
            clearable
            autocomplete="off"/>
        </el-form-item>
        <el-form-item label="初始密码" style="margin-bottom:0">
          123456
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSure">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { userList, addUser, deleteUser } from './request.js'
import ContainerTitle from '@/common/components/ContainerTitle.vue'

export default {
  components: { ContainerTitle },
  data() {
    return {
      loading: false,
      userList: [],
      currentPage: 1,
      pageSize: 20,
      listTotal: 0,
      form: {
        username: ''
      },
      addUserForm: {
        username: ''
      },
      addUserRules: {
        username: [
          { trigger: 'blur', required: true, message: '用户名不能为空' }
        ]
      },
      dialogFormVisible: false
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.loading = true
      const params = {
        pageCount: this.currentPage,
        size: this.pageSize,
        userName: this.form.username
      }
      userList(params)
        .then(res => {
          this.loading = false
          if (res.data.status === 1) {
            this.listTotal = res.data.data.total
            this.userList = res.data.data.list
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(res => {
          this.loading = false
          // this.$message.error(res.data.msg)
        })
    },
    addUserOperation() {
      this.dialogFormVisible = true
      this.addUserForm.username = ''
    },
    dialogSure() {
      this.$refs.addUserForm.validate(valide => {
        if (valide) {
          this.loading = true
          addUser(this.addUserForm)
            .then(res => {
              this.loading = false
              if (res.data.status !== 1) {
                this.$message.error(res.data.msg)
              } else {
                this.dialogFormVisible = false
                this.addUserForm.username = ''
                this.getUserList()
              }
            })
            .catch(res => {
              this.loading = false
              this.$message.error(res)
            })
        }
      })
    },

    deleteUserOperation(id) {
      const params = {
        uid: id
      }
      deleteUser(params)
        .then(res => {
          this.loading = false
          if (res.data.status === 1) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.getUserList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(res => {
          this.loading = false
          this.$message.error('请求错误')
        })
    },

    editUser(id) {},

    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    }
  }
}
</script>

<style lang="scss">
    .el-dialog__header{
        border-bottom: 1px solid #eee;
    }
</style>
