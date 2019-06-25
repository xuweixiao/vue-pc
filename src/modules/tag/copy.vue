<template>
  <div class="main-container">

    <container-title :title-text="'标注中心'">
      <el-radio-group
        v-model="scale"
        style="margin-right:10px"
        size="small"
        @change="scaleRadio">
        <el-radio-button label="原图"/>
        <el-radio-button label="放大图"/>
      </el-radio-group>
      <el-button
        style="margin-right:10px"
        type="warning"
        @click="dialogFormVisible = true">上传照片</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </container-title>

    <div v-loading="AllLoading" class="main-container-content">
      <el-row :gutter="20">
        <!-- 列表 -->
        <el-col :span="6">
          <el-table
            :data="tagsList"
            border
            highlight-current-row
            @row-click="rowTagClick">
            <el-table-column
              :show-overflow-tooltip="true"
              label="图片ID"
              prop="id"
              align="center"
              fixed/>
            <el-table-column
              label="状态"
              align="center"
              fixed>
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 1" type="success">已标记</el-tag>
                <el-tag v-if="scope.row.status === 2" type="info">未标记</el-tag>
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
            layout="prev, pager, next"
            @current-change="handleCurrentChange"/>
        </el-col>

        <!-- 标注 -->
        <el-col :span="18">
          <!-- 标注图片 -->
          <div
            v-loading="loading"
            ref="tagImgContainer"
            :style="{height: (screenHeight/3 *2) +'px'}"
            class="tag-img-contianer">
            <img
              id="topImg"
              ref="topImg"
              src=""
              class="tag-img"
              @error="loading = false">
            <div
              ref="tagId"
              class="biaoDiv"
              @mousedown="mousedown"
              @mousemove="mousemove"
              @mouseup="mouseup">
              <div
                v-for="item in tagIngList"
                :key="item.id"
                :id="item.id"
                :class="{selectLine:item.id==isActive}"
                :style="{height:item.h+'px',width:item.w+'px',left:item.x+'px',top:item.y+'px'}"
                class="line"
                @keyup="moveLeft($event)"
                @click="lineClick(item.id)">
                <i class="el-icon-remove tab-delete pointer" @click="deleteTagLine(item.id)"/>
              </div>
            </div>

            <el-dialog
              :style="{left:tagLeft+'px',top:tagTop+'px'}"
              :modal="true"
              :close-on-click-modal="false"
              :show-close="false"
              :append-to-body="false"
              :visible.sync="dialogTagVisible"
              width="250px"
              class="tagDialog">
              <el-form
                ref="form"
                :model="form"
                label-width="40px">
                <el-form-item
                  label="内容"
                  prop="t">
                  <el-input
                    v-model="form.t"
                    placeholder="标注内容"
                    clearable
                    autocomplete="off"/>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTagVisible=false">取 消</el-button>
                <el-button type="primary" @click="tagDiaglogSure">确 定</el-button>
              </div>
            </el-dialog>
          </div>

          <!-- 标注列表 -->
          <div class="tag-content-contianer">
            <el-table
              :height="screenHeight/3"
              :data="tagIngList"
              border
              highlight-current-row
              @row-click="rowLineClick">
              <el-table-column
                :show-overflow-tooltip="true"
                label="标注"
                prop="t"
                align="center"
                fixed>
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type"
                    v-model="scope.row.nt"/>
                  <span v-else>{{ scope.row.t }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="X坐标"
                prop="x"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type"
                    v-model="scope.row.x"/>
                  <span v-else>{{ scope.row.x }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="Y坐标"
                prop="y"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type"
                    v-model="scope.row.y"/>
                  <span v-else>{{ scope.row.y }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="宽"
                prop="w"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type"
                    v-model="scope.row.w"/>
                  <span v-else>{{ scope.row.w }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="高"
                prop="h"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type"
                    v-model="scope.row.h"/>
                  <span v-else>{{ scope.row.h }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.type"
                    type="text"
                    size="small"
                    @click="saveRow(scope.row)">保存</el-button>
                  <el-button
                    v-else
                    type="text"
                    size="small"
                    @click="scope.row.type=true">编辑</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteRow(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 上传图片 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      title="上传单据"
      width="400px">
      <el-upload
        :on-change="fileChange"
        :before-remove="beforeRemove"
        :limit="1"
        :auto-upload="false"
        :with-credentials="true"
        :on-exceed="handleExceed"
        class="upload-demo"
        action="/label/uploadSheet"
        name="file">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogUpImageSure">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { tagList, upImage, tagDetail, saveTag } from './request.js'
import ContainerTitle from '@/common/components/ContainerTitle.vue'
import clientHeight from '@/common/mixins/clientHeight'
const baseUrl = 'http://139.129.205.233:17676'

export default {
  components: { ContainerTitle },
  mixins: [clientHeight],
  data() {
    return {
      loading: false,
      tagsList: [],
      currentPage: 1,
      pageSize: 20,
      listTotal: 0,
      rowList: [],
      dialogFormVisible: false,
      height: 170,
      mDown: false,
      firstMove: true,
      mMove: false,
      mDownX: 0,
      mDownY: 0,
      tagIngList: [], // 标注线
      scale: '原图',
      dialogTagVisible: false,
      curTagLine: null,
      file: {}, // 上传图片file
      curImageUrl: '', // 图片url
      oriImgWidht: 0,
      oriImgHeight: 0,
      AllLoading: false,
      sid: 13,
      isActive: -1,
      clickLine: null,
      shiftDown: false,
      tagLeft: 0,
      tagTop: 0,
      form: {
        t: ''
      } // 标注弹框
    }
  },
  watch: {
    screenHeight(val) {
    }
  },
  mounted() {
    this.getTagList()

    document.onkeydown = (e) => {
      if (e.key === 'Shift') {
        console.log('shift')
        this.shiftDown = true
      }
      if (e.key === 'ArrowRight') {
        console.log('right', this.shiftDown)
        if (this.shiftDown) {
          this.changeLineData('right')
        }
      }
      if (e.key === 'ArrowLeft') {
        console.log('left')
        if (this.shiftDown) {
          this.changeLineData('left')
        }
      }
      if (e.key === 'ArrowUp') {
        console.log('up')
        if (this.shiftDown) {
          this.changeLineData('up')
        }
      }
      if (e.key === 'ArrowDown') {
        console.log('down')
        if (this.shiftDown) {
          this.changeLineData('down')
        }
      }
    }
    document.onkeyup = (e) => {
      if (e.key === 'Shift') {
        console.log('shift' + '--up')
        this.shiftDown = false
      }
    }
  },
  methods: {
    /**
     * 标注内容弹框确认
     */
    tagDiaglogSure() {
      this.dialogTagVisible = false
      const val = this.tagIngList[this.tagIngList.length - 1]
      val.t = this.form.t
      this.$set(this.tagIngList, this.tagIngList.length - 1, val)
      this.form.t = ''
    },
    /**
     * 方向键移动框
     */
    changeLineData(director) {
      console.log()
      let x = 0
      let y = 0
      switch (director) {
        case 'up':
          y = -1
          break
        case 'down':
          y = 1
          break
        case 'left':
          x = -1
          break
        case 'right':
          x = 1
          break
      }
      if (this.isActive === -1) {
        this.$message({
          type: 'info',
          message: '请选中框后在进行该操作'
        })
        return
      }
      this.tagIngList.forEach((value, index) => {
        if (this.isActive === value.id) {
          value.x = value.x + x
          value.y = value.y + y
          this.$set(this.tagIngList, index.value)
        }
      })
    },
    /**
     * 框点击
     */
    lineClick(id) {
      this.isActive = id
    },
    /**
     * 放大缩小
     */
    scaleRadio() {
      console.log(this.scale)
      if (this.scale === '原图') {
        this.orginImage(0.5)
      } else {
        this.scaleChange(2)
      }
    },
    /**
    *上传标注数据
     */
    save() {
      this.AllLoading = true
      let ret = []
      if (this.scale === '原图') {
        this.tagIngList.forEach((value, index) => {
          value.h = value.h * 2
          value.w = value.w * 2
          value.x = value.x * 2
          value.y = value.y * 2
          ret.push(value)
        })
      } else {
        ret = this.tagIngList
      }
      const params = {
        sid: this.sid,
        labelContent: JSON.stringify(ret)
      }
      saveTag(params)
        .then(res => {
          this.AllLoading = false
          if (res.data.status === 1) {
            this.tagIngList = []
            this.$refs.topImg.src = ''
            this.getTagList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(res => {
          this.AllLoading = false
          this.$message.error(res)
        })
    },

    /**
   * 放大图
   */
    scaleChange(val) {
      console.log(this.oriImgWidht, '比例', this.oriImgHeight)
      this.$refs.topImg.style.height = this.oriImgHeight + 'px'
      this.$refs.tagId.style.height = this.oriImgHeight + 'px'
      this.$refs.topImg.style.width = this.oriImgWidht + 'px'
      this.$refs.tagId.style.width = this.oriImgWidht + 'px'
      this.tagIngList.forEach((value, index) => {
        value.h = value.h * val
        value.w = value.w * val
        value.x = value.x * val
        value.y = value.y * val
        this.$set(this.tagIngList, index, value)
      })
    },

    /**
   * 原图
   */
    orginImage(val) {
      this.$refs.topImg.style.height = this.oriImgHeight * val + 'px'
      this.$refs.tagId.style.height = this.oriImgHeight * val + 'px'
      this.$refs.topImg.style.width = this.oriImgWidht * val + 'px'
      this.$refs.tagId.style.width = this.oriImgWidht * val + 'px'
      this.tagIngList.forEach((value, index) => {
        value.h = value.h * val
        value.w = value.w * val
        value.x = value.x * val
        value.y = value.y * val
        this.$set(this.tagIngList, index, value)
      })
    },

    /**
     * 切换页
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTagList()
    },
    /**
     * 标注列表
     */
    getTagList() {
      this.loading = true
      const params = {
        pageCount: this.currentPage,
        size: this.pageSize
      }
      tagList(params)
        .then(res => {
          this.loading = false
          if (res.data.status === 1) {
            this.tagsList = res.data.data.list
            this.listTotal = res.data.data.total
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res)
        })
    },

    dialogTagClose() {
      this.dialogTagVisible = false
      this.tagIngList = this.tagIngList.map(res => {
        if (res.id !== this.curTagLine.id) {
          return res
        }
      })
    },
    dialogTagSure() {
      this.dialogTagVisible = false
    },
    /**
    *标注列表保存
     */
    saveRow(obj) {
      obj.t = obj.nt
      obj.type = false
      this.tagIngList.forEach((value, index) => {
        if (value.id === obj.id) {
          this.$set(this.tagIngList, index, obj)
        }
      })
    },
    /**
    * 删除标注
     */
    deleteRow(obj) {
      this.tagIngList.forEach((value, index) => {
        if (value.id === obj.id) {
          this.tagIngList.splice(index, 1)
        }
      })
    },
    /**
     * 选择图片改变事件
     */
    fileChange(file, fileList) {
      this.file = file
    },
    /**
     * 上传图片
     */
    dialogUpImageSure() {
      this.loading = true
      const param = new FormData() // 创建form对象
      param.append('file', this.file.raw) // 通过append向form对象添加数据
      upImage(param)
        .then(res => {
          this.loading = false
          if (res.data.status === 1) {
            this.dialogFormVisible = false
            this.getTagList()
            this.file = null
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(res => {
          this.loading = false
          this.$message.error('请求错误')
        })
    },
    /**
     * 图片限制
     */
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    /**
     * 图片移除
     */
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    /**
     * 获取标注详情
     */
    getTagDetailOpration(val) {
      this.tagIngList = []
      this.isActive = false
      this.scale = '原图'
      this.shiftDown = false
      this.loading = true
      this.sid = val.id
      const params = {
        sid: val.id
      }
      tagDetail(params)
        .then(res => {
          this.loading = false
          if (res.data.status === 1) {
            this.curImageUrl = baseUrl + res.data.data.imgUrl
            this.$refs.topImg.src = this.curImageUrl
            this.loading = true
            if (res.data.data.labelContent !== null) {
              console.log('list not null')
              this.tagIngList = JSON.parse(res.data.data.labelContent)
              this.tagIngList.forEach((val, index) => {
                val.type = false
                this.$set(this.tagIngList, index, val)
              })
            } else {
              console.log('list null')
              this.tagIngList = []
            }

            const obj = document.getElementById('topImg')
            this.oriImgWidht = res.data.data.width
            this.oriImgHeight = res.data.data.height
            this.orginImage(0.5)
            obj.onload = () => {
              this.loading = false
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.response)
        })
    },

    /**
     * 行点击
     */
    rowTagClick(row) {
      this.getTagDetailOpration(row)
    },
    /**
     *标线框table点击
     */
    rowLineClick(row) {
      this.isActive = row.id
      this.clickLine = row
    },
    /**
     * 删除标注线
     */
    deleteTagLine(id) {
      this.dialogTagVisible = false
      this.form.t = ''
      for (let i = 0; i < this.tagIngList.length; i++) {
        if (this.tagIngList[i].id === id) {
          this.tagIngList.splice(i, 1)
          return
        }
      }
    },

    /**
     * 画框开始
     */
    mousedown(event) {
      this.mDownX = event.layerX
      this.mDownY = event.layerY
      this.form.t = ''
      this.mDown = true
      this.firstMove = true
      this.mMove = false
    },
    /**
    * 画框过程
    */
    mousemove(event) {
      if (this.mDown) {
        if (this.firstMove) {
          if (this.tagIngList.length === 0) {
            this.tagIngList.push({
              id: 1,
              x: this.mDownX,
              y: this.mDownY
            })
          } else {
            this.tagIngList.push({
              id: this.tagIngList[this.tagIngList.length - 1].id + 1,
              x: this.mDownX,
              y: this.mDownY,
              type: false
            })
          }
          this.curTagLine = this.tagIngList[this.tagIngList.length - 1]
          this.mMove = true
        }
        this.firstMove = false
        const x = event.layerX
        const y = event.layerY
        const id = this.tagIngList[this.tagIngList.length - 1].id
        this.$set(this.tagIngList, this.tagIngList.length - 1, { id: id, w: x - this.mDownX - 2, h: y - this.mDownY - 2, x: this.mDownX, y: this.mDownY, type: false })
      }
    },
    /**
     * 画框结束
     */
    mouseup(event) {
      this.mDown = false
      this.firstMove = true
      if (this.mMove) {
        this.dialogTagVisible = true
        this.tagLeft = this.tagIngList[this.tagIngList.length - 1].x + this.tagIngList[this.tagIngList.length - 1].w + 20
        this.tagTop = this.tagIngList[this.tagIngList.length - 1].y
      }
    },
    /**
     * 键盘左移动
     */
    moveLeft(ev) {
      console.log('ddd')
    }
  }
}
</script>

<style lang="scss">
    .el-dialog__header{
        border-bottom: 1px solid #eee;
    }
    .tag-img-contianer{
         overflow: auto;
         position: relative;

        .tag-img{
            width: 100%;
            height: 100%;
        }
    }
    .tag-content-contianer{
        margin-top: 15px;
    }

    // 标注
    .biaoDiv{
        position: absolute;
        z-index: 5;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .line{
        border: 1px solid #409EFF;
        position: absolute;
        left: 0;
        top:0;
        width: 0;
        height: 0;
    }
    .tab-delete{
        position: absolute;
        left: -9px;
        top: -9px;
        width: 15px;
        height: 15px;
    }
    .pointer{
        cursor: pointer;
    }
    .selectLine{
      border-color:#ee420e;
      z-index: 5;
      box-shadow: 0 0 2px rgb(209, 238, 140);
    }
    .tagDialog{
      position: absolute;
      width: 250px;
      height:220px;
      left: 0;
      right: 0;
      .el-dialog__header{
        display: none;
      }
      .el-dialog__body{
        padding: 20px 15px;
      }
      .el-form-item{
        margin-bottom: 0 !important;
      }
      .el-dialog{
        margin-top: 0 !important;
      }
    }
    .v-modal{
        opacity: 0;
    }
</style>
