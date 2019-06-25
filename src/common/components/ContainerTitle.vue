<template>
    <div class="container-title">
        <div class="text">{{titleText}}</div>
        <div class="left-content">
            <slot name="leftBtn"></slot>
        </div>
        <div class="content"><slot></slot></div>
    </div>
</template>

<script>
export default {
  props: {
    titleText: {
      type: String,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
    .container-title{
        height: 50px;
        padding-left: 16px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eef0f5;
        box-sizing: border-box;
        background-color: #fff;
        position: relative;
        padding-right: 24px;

        .text{
            color: #262626;
            font-size: 16px;
            font-weight: 600;
            height: 16px;
            line-height: 16px;
            padding-left: 10px;
            position: relative;
            vertical-align: middle;
            &::before{
                border-right: 3px solid #1890ff;
                content: "";
                display: inline-block;
                height: 16px;
                left: 0;
                position: absolute;
                top: 0;
                vertical-align: middle;
            }
        }

        .content{
            display: flex;
            position: absolute;
            right: 24px;
        }

        .left{
            float: left;
        }

        .left-content{
            margin-left: 20px;
        }

        .right{
            float: right;
        }
    }
</style>
