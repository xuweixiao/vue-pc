/**
 * @file 屏幕的高度设置，界面尽量在一屏显示，不出现滚动条
 * @author 徐丹锋
 * @usage 设置的高度为screenHeight，同时需在data里设置height。
 * 使用方法：fixedHeight为页面固定高度，在crm项目中为顶导航的高度加上一些每个页面都有的padding
 *         screenHeight高度最小为300
 *         height为具体业务页面里所占用的高度
 *         clientHeight为浏览器高度
 *         screenHeight = clientHeight - fixedHeight - height （当小于300时，设为300）
 */

// 一些固定高度
// const fixedHeight = 60 + 16 * 2 + 24 * 2
// table的最小高度
const minHeight = 300

export default {
  data () {
    return {
      screenHeight: 350,
      height: 0
    }
  },
  created () {
    this.$nextTick(() => {
      this.calcHeight()
      window.addEventListener('resize', this.calcHeight)
    })
  },
  methods: {
    getClientHeight () {
      let clientHeight = 0
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
      } else {
        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
      }
      return clientHeight
    },
    calcHeight () {
      setTimeout(() => {
        this.screenHeight = (this.getClientHeight() - this.height) <= minHeight ? minHeight : (this.getClientHeight() - this.height)
        this.screenHeight = this.screenHeight// todo 为了测试
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calcHeight)
  }
}
