<template>
  <div class="main-container">

    <container-title :title-text="'标注中心'">
      <el-tooltip class="item" effect="dark" content="切换前，请点击保存按钮，否则信息丢失！" placement="top">
        <el-radio-group
          v-model="tabStatue"
          :disabled="sid ===''"
          style="margin-right:10px"
          size="small"
          @change="tabChange">
          <el-radio-button
            label="预览标注"/>
          <el-radio-button
            label="一次打印"/>
          <el-radio-button
            label="二次打印"/>
        </el-radio-group>
      </el-tooltip>
      <el-radio-group
        v-model="scale"
        :disabled="sid ===''"
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
      <el-button
        :disabled="sid ==='' || tabStatue === '预览标注'"
        type="primary"
        @click="save">保存</el-button>
    </container-title>

    <div v-loading="AllLoading" class="main-container-content">
      <el-row :gutter="20">
        <!-- 列表 -->
        <el-col :span="6">
          <el-table
            ref="tabLeftTable"
            :height="screenHeight-30"
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
            :pager-count="pageButtonSize"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :total="listTotal"
            background
            small
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
                @click="lineClick(item)">
                <i class="el-icon-remove tab-delete pointer" @click="deleteTagLine(item.id)"/>
              </div>
            </div>
            <div
              :style="{'z-index':ZIndex,'width': allWidth,'height':allHeight}"
              class="biaoDiv"/>

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
                    v-focus="focusState"
                    v-model="form.t"
                    placeholder="标注内容"
                    clearable
                    type="textarea"
                    autocomplete="off"
                    @blur="focusState = false"/>
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
              ref="tabTable"
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
                    v-model="scope.row.t"
                    type="textarea"/>
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
                    v-model="scope.row.x"
                    type="number"/>
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
                    v-model="scope.row.y"
                    type="number"/>
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
                    v-model="scope.row.w"
                    type="number"/>
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
                    v-model="scope.row.h"
                    type="number"/>
                  <span v-else>{{ scope.row.h }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="tabStatue !== '预览标注'"
                label="操作"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.type"
                    type="text"
                    size="small"
                    @click="saveRow(scope.row,$event)">保存</el-button>
                  <el-button
                    v-else
                    type="text"
                    size="small"
                    @click="editRow(scope.row,$event)">编辑</el-button>
                  <el-button
                    type="text"
                    style="color:#f56c6c"
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
        :on-remove="imgDeleteSuccess"
        :before-remove="beforeRemove"
        :limit="1"
        :file-list="fileList"
        :auto-upload="false"
        :with-credentials="true"
        :on-exceed="handleExceed"
        class="upload-demo"
        action="/label/uploadSheet"
        name="file">
        <el-button size="small" type="primary">点击上传</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="imgDialogClose">取 消</el-button>
        <el-button
          :disabled="file === null"
          type="primary"
          @click="dialogUpImageSure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 确认保存 -->
    <el-dialog
      :visible.sync="tabChangeVisible"
      title="保存标注"
      width="300px">
      <span>请确认标注信息是否保存了，是否要跳转？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tabChangeVisible = false">取 消</el-button>
        <el-button type="primary" @click="tabChangeVisible = false">确 定</el-button>
      </span>
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
  directives: {
    focus: {
      update(el, { value }) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  mixins: [clientHeight],
  data() {
    return {
      tabIndex: 0,
      tabChangeVisible: false,
      ZIndex: 10,
      allHeight: '100%',
      allWidth: '100%',
      loading: false,
      tagsList: [],
      allTagList: [], // 打印预览
      oneTagList: [], // 一次打印
      twoTagList: [], // 二次打印
      currentPage: 1,
      pageSize: 20,
      pageButtonSize: 5,
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
      tabStatue: '预览标注',
      tabStatueLast: '预览标注',
      dialogTagVisible: false,
      curTagLine: null,
      file: null, // 上传图片file
      curImageUrl: '', // 图片url
      oriImgWidht: 0,
      oriImgHeight: 0,
      AllLoading: false,
      sid: '',
      isActive: -1,
      clickLine: null,
      shiftDown: false,
      tagLeft: 0,
      tagTop: 0,
      form: {
        t: ''
      }, // 标注弹框
      fileList: [],
      focusState: false
    }
  },
  watch: {
    screenHeight(val) {
    }
  },
  mounted() {
    this.getTagList()

    document.onkeydown = (e) => {
      if (e.key === 'Tab' && this.sid !== '') {
        console.log(this.tabIndex)
        this.tabIndex = this.tabIndex + 1
        if (this.tabIndex >= this.tagIngList.length) {
          this.tabIndex = 0
        }
        this.lineClick(this.tagIngList[this.tabIndex])
      }
      if (e.key === 'Shift') {
        this.shiftDown = true
      }
      if (e.key === 'ArrowRight') {
        if (this.shiftDown) {
          this.changeLineData('right')
        }
      }
      if (e.key === 'ArrowLeft') {
        if (this.shiftDown) {
          this.changeLineData('left')
        }
      }
      if (e.key === 'ArrowUp') {
        if (this.shiftDown) {
          this.changeLineData('up')
        }
      }
      if (e.key === 'ArrowDown') {
        if (this.shiftDown) {
          this.changeLineData('down')
        }
      }
    }
    document.onkeyup = (e) => {
      if (e.key === 'Shift') {
        this.shiftDown = false
      }
    }
  },
  methods: {
    /*
    *编辑保存
     */
    editRow(obj, e) {
      console.log(obj, 'edit')
      obj.type = true
      this.tagIngList.forEach((value, index) => {
        if (value.id === obj.id) {
          this.$set(this.tagIngList, index, obj)
        }
      })
      e.stopPropagation()
    },
    /**
     * 设置表格那行选中
     */
    setCurrentRow(row) {
      this.$refs.tabTable.setCurrentRow(row)
    },

    /**
     * 设置表格那行选中
     */
    setLeftTableRow(row) {
      this.$refs.tabLeftTable.setCurrentRow(row)
    },

    /**
     * 初始化视图
     */
    initView() {
      this.ZIndex = 10
      this.tagIngList = []
      this.twoTagList = []
      this.oneTagList = []
      this.allTagLis = []
      this.scale = '原图'
      this.isActive = false
      this.shiftDown = false
      this.tabStatue = '预览标注'
    },

    /**
    *标注切换
     */
    tabChange() {
      if (this.tabStatue === '预览标注') {
        this.ZIndex = 10
        this.tagIngList = this.oneTagList.concat(this.twoTagList)
      } else if (this.tabStatue === '一次打印') {
        this.ZIndex = -1
        this.tagIngList = this.oneTagList
      } else if (this.tabStatue === '二次打印') {
        this.ZIndex = -1
        this.tagIngList = this.twoTagList
      }
    },

    imgDialogClose() {
      this.dialogFormVisible = false
      this.file = null
      this.fileList = []
    },
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
    lineClick(item) {
      this.isActive = item.id
      this.setCurrentRow(item)
      this.tagIngList.forEach((value, index) => {
        if (item.id === value.id) {
          this.tabIndex = index
        }
      })
    },
    /**
     * 放大缩小
     */
    scaleRadio() {
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
          delete value.id
          delete value.type
          ret.push(value)
        })
      } else {
        ret = this.tagIngList
      }
      const params = {
        sid: this.sid,
        labelType: this.tabStatue === '一次打印' ? 1 : 2,
        labelContent: JSON.stringify(ret)
      }
      saveTag(params)
        .then(res => {
          this.AllLoading = false
          if (res.data.status === 1) {
            this.tagIngList = []
            this.$refs.topImg.src = ''
            this.$message({ type: 'success', message: '保存成功了' })
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
      this.$refs.topImg.style.height = this.oriImgHeight + 'px'
      this.$refs.tagId.style.height = this.oriImgHeight + 'px'
      this.$refs.topImg.style.width = this.oriImgWidht + 'px'
      this.$refs.tagId.style.width = this.oriImgWidht + 'px'
      this.allHeight = this.$refs.tagId.style.height
      this.allWidth = this.$refs.tagId.style.width
      this.changeList('oneTagList', val)
      this.changeList('twoTagList', val)
    },

    /**
     *放大视图控制数据
     */
    changeList(list, val) {
      this[list].forEach((value, index) => {
        value.h = value.h * val
        value.w = value.w * val
        value.x = value.x * val
        value.y = value.y * val
        this.$set(this[list], index, value)
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
      this.allHeight = this.$refs.tagId.style.height
      this.allWidth = this.$refs.tagId.style.width
      this.changeList('oneTagList', val)
      this.changeList('twoTagList', val)
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
            this.initView()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .then(res => {
          if (this.sid !== '') {
            this.tagsList.forEach((value, index) => {
              if (value.id === this.sid) {
                this.setLeftTableRow(value)
              }
            })
            this.getTagDetailOpration(this.sid)
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
    saveRow(obj, e) {
      obj.t = obj.t
      obj.type = false
      this.tagIngList.forEach((value, index) => {
        if (value.id === obj.id) {
          this.$set(this.tagIngList, index, obj)
        }
      })
      e.stopPropagation()
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
     *图片删除成功
     */
    imgDeleteSuccess(file, fileList) {
      this.fileList = []
      this.file = null
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
            this.fileList = []
            this.file = null
            this.getTagList()
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
    getTagDetailOpration(id) {
      this.initView()
      this.sid = id
      const params = {
        sid: id
      }
      tagDetail(params)
        .then(res => {
          this.loading = false
          if (res.data.status === 1) {
            this.curImageUrl = baseUrl + res.data.data.imgUrl
            this.$refs.topImg.src = this.curImageUrl
            this.loading = true
            const obj = document.getElementById('topImg')
            this.oriImgWidht = res.data.data.width
            this.oriImgHeight = res.data.data.height
            obj.onload = () => {
              this.loading = false
            }
            if (res.data.data.labelContentOne !== null && res.data.data.labelContentOne !== '') {
              this.oneTagList = JSON.parse(res.data.data.labelContentOne)
            } else {
              this.oneTagList = []
            }
            if (res.data.data.labelContentTwo !== null && res.data.data.labelContentTwo !== '') {
              this.twoTagList = JSON.parse(res.data.data.labelContentTwo)
            } else {
              this.twoTagList = []
            }
            this.allTagList = this.oneTagList.concat(this.twoTagList)
            this.tagIngList = this.allTagList
            this.tagIngList.forEach((val, index) => {
              val.type = false
              val.id = index
              this.$set(this.tagIngList, index, val)
            })
            this.orginImage(0.5)
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
      this.getTagDetailOpration(row.id)
    },
    /**
     *标线框table点击
     */
    rowLineClick(row) {
      this.isActive = row.id
      this.clickLine = row
      this.tagIngList.forEach((value, index) => {
        if (row.id === value.id) {
          this.tabIndex = index
        }
      })
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
              id: new Date().getTime(),
              x: this.mDownX,
              y: this.mDownY
            })
          } else {
            this.tagIngList.push({
              id: new Date().getTime() + 1,
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
        if (event.srcElement.className === 'biaoDiv' && x > this.mDownX && y > this.mDownY) {
          this.$set(this.tagIngList, this.tagIngList.length - 1, { id: id, w: x - this.mDownX - 5, h: y - this.mDownY - 5, x: this.mDownX, y: this.mDownY, type: false })
        }
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
        this.focusState = true
        this.tagLeft = this.tagIngList[this.tagIngList.length - 1].x + this.tagIngList[this.tagIngList.length - 1].w + 20
        this.tagTop = this.tagIngList[this.tagIngList.length - 1].y
      }
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
      position: absolute !important;
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
        opacity: 0 !important;
        display: none;
    }
</style>
