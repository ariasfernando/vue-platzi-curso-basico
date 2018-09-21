<template>
  <div class="row topbar">
    <div class="topbar-col is-aligned-center is-justified-start" :class="leftClasses">
      <div v-if="hasBackButton" class="back-btn beta-btn-secondary pull-left" @click="$router.push('/')">
        <i class="glyphicon glyphicon-menu-left"></i>
        <a href="#" >Back</a>
      </div>
      <slot name="left"></slot>
    </div>

    <div class="topbar-col is-aligned-center is-justified-center" :class="centerClasses">
      <slot name="center"></slot>
    </div>

    <div class="topbar-col is-aligned-center is-justified-end" :class="rightClasses">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      leftClasses: {
        type: String,
        default: 'col-xs-3',
      },
      centerClasses: {
        type: String,
        default: 'col-xs-6',
      },
      rightClasses: {
        type: String,
        default: 'col-xs-3',
      },
      hasBackButton: {
        type: Boolean,
        default: true,
      },
    },
  }
</script>
<style lang="less" scoped>
@stensul-purple: #514960;
@stensul-white: #ffffff;
  .topbar {
    color: @stensul-purple;
    background-color: #ffffff;
    height: 40px;
    box-shadow: 0px 0px 4px #999999;
    min-width: 1200px;
    font-size: 18px;
    font-family: "Open Sans", Arial, sans-serif;
    font-weight: 300;

    &-col {
      height: 100%;
      display: flex;
    }

    .switch {
      position: relative;
      height: 29px;
      width: 100px;
      background: @stensul-white;
      border-radius: 3px;
      margin: 0 auto;
      border: 1px solid #dfdfdf;
      margin-top: -3px;
    }

    .switch-label {
      position: relative;
      z-index: 2;
      float: left;
      width: 49px;
      line-height: 21px;
      font-size: 16px;
      color: @stensul-purple;
      text-align: center;
      cursor: pointer;
      margin: 0 !important;

      i {
        display: inline-block;
        vertical-align: sub;
      }
    }

    .switch-label:active {
      font-weight: bold;
    }

    .switch-label-off {
      padding-left: 2px;
    }

    .switch-label-on {
      padding-right: 2px;
    }

    .switch-input {
      display: none;
    }

    .switch-input:checked + .switch-label {
      font-weight: bold;
      color: #fff;
      -webkit-transition: 0.15s ease-out;
      -moz-transition: 0.15s ease-out;
      -o-transition: 0.15s ease-out;
      transition: 0.15s ease-out;
    }

    .switch-input:checked + .switch-label-on ~ .switch-selection {
      left: 50px;
    }

    .switch-selection {
      display: block;
      position: absolute;
      z-index: 1;
      top: 2px;
      left: 2px;
      width: 46px;
      height: 23px;
      border-radius: 2px;
      background: @stensul-purple;
      -webkit-transition: left 0.15s ease-out;
      -moz-transition: left 0.15s ease-out;
      -o-transition: left 0.15s ease-out;
      transition: left 0.15s ease-out;
    }

    .back-btn {
      margin-right: 10px;
    }
  }

  .is-aligned-center {
    align-items: center;
  }

  .is-justified {
    &-start {
      justify-content: start;
    }
    &-center {
      justify-content: center;
    }
    &-end {
      justify-content: end;
    }
  }
</style>
