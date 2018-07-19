<template>
    <div class="column-bar-container">
      <slot></slot>
    </div>
</template>
<script>
export default {
  name: "ColumnBarContainer",
  props: ["side"],
};
</script>
<style lang="scss" scoped>
.column-bar-container{
    &:hover{
      overflow: overlay
    }
    &::-webkit-scrollbar {
        width: 2px; 
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: #6666;
    }
}
.column-bar-container /deep/ {
    height: calc(100vh - 86px);
    overflow: auto;
    overflow: overlay;
    width: 270px;
    display: block;
    float: left;
    padding: 0px;
    font-family: 'Open Sans', Helvetica, Arial, sans-serif;
    padding-bottom: 25px;
    background: #fff;

    .btn.btn-secondary.btn-block {
      &:hover,
      &:visited,
      &:focus,
      &:active,
      &:active:focus {
        color: #666666;
      }
    }
    .fa.pull-left {
      margin-right: 12px;
    }

    .components-list {
      padding: 0;
      margin: 0;

      .component-item {
        cursor: pointer;
        list-style-type: none;
        font-size: 14px;
        background-color: #f4f4f4;
        border: 1px solid #d8d8d8;
        border-radius: 2px;
        padding: 25px 20px 19px 20px;
        width: 49%;
        margin-right: 4px;
        margin-bottom: 4px;
        float: left;
        text-align: center;
        transition: all 0.3s linear;

        i {
          margin: 0 5px;
          color: #514960;
          font-size: 28px;
        }
        p {
          display: inline-block;
          font-size: 12px;
          margin: 0px;
          padding: 0px;
          font-weight: 400px;
          color: #666666;
          width: 100%;
          font-weight: 300;
          text-align: center;
        }

        &:hover {
          border: 1px solid #888888;

          p {
            color: #333333;
          }
        }

        &:nth-child(even){
          margin-right: 0px;
        }
      }
    }

    .card {
      padding: 0 8px 15px 8px;
      border-bottom: 1px solid #f0f0f0;
      border-top: 1px solid #ffffff;
      margin-top: -1px;
      display: table;
      width: 100%;
    }

    select {
      height: 22px;
      font-size: 11px;
      color: #666666;
      border: none;
      background: #f4f4f4;
      box-shadow: none;
      font-weight: 300;
      width: 65px;
      float: right;
    }

    select[multiple] {
      height: 50px;
    }

    .vue-js-switch {
      float: right;
      padding-top: 0px;
      margin: 0px;
    }

    .content-colorpicker {
      .sketch-picker {
        display: none;
        position: absolute !important;
        z-index: 300;
        right: 100%;
      }
      .icon-remove {
        color: #999999;
        background: #ffffff;
        border: 1px solid #cccccc;
        margin-top: -40px;
        margin-left: -35px;
        padding-top: 4px;
      }
    }
    .card-header {
      padding-bottom: 10px;
      ul {
        margin-left: -8px;
        margin-right: -8px;
        border-bottom: 1px solid #dddddd;

        .nav-item {
          border-top: 1px solid #dddddd;
          border-left: 1px solid #dddddd;
          margin-bottom: -2px;

          &:first-child {
            margin-left: 10px;
          }

          &:last-of-type {
            border-right: 1px solid #dddddd;
          }
          .nav-link {
            margin-right: 0;
            padding: 4px 7px;
            border: 0;
            border-radius: 0;
            font-weight: 300;
            color: #666666;
            &.active {
              border-bottom: 2px solid #78dcd6;
              background: #78dcd64d;
            }
            &:focus {
              background-color: transparent;
            }
            &:hover {
              background-color: #78dcd64d;
            }
          }
        }
      }
    }
  }
</style>