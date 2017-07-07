<template>
  <!-- DIVIDER ELEMENT -->
    <tr @click="setComponent">
      <td :bgcolor="backgroundColor" class="st-separator st-position-relative" :style="component.style">
        <table style="width:100%;" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td :width="separatorWidth" :height="separatorHeight"></td>
          </tr>
        </table>
        <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div> 
      </td>
    </tr>
  <!-- DIVIDER ELEMENT ENDS -->
</template>

<script>
  export default {
    name: 'DividerElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    data () {
      return {
        backgroundColor: '',
        separatorHeight: '',
        separatorWidth: ''
      }
    },
    created () {
      this.setupModule();
    },
    methods: {
      setupModule () {
        this.backgroundColor = this.component.style.backgroundColor;
        this.separatorHeight = this.component.height;
        this.separatorWidth = this.component.width;
      },
      setComponent() {
        this.$store.commit("module/setCurrentComponent", {
          columnId: this.columnId,
          componentId: this.componentId
        });
      }
    }
  };
</script>

<style lang="less">
  @icon-option: #56106d;

  .st-separator {
    width: 100%;
    border: none;
  }

  .st-position-relative{
    position: relative;
  }

  .icon-move {
    display: none;
    cursor: move;
    cursor: -webkit-grabbing;
    position: absolute;
    top: 50%;
    text-align: center;
    color: #fff;
    z-index: 5;
    right: -15px;
    height: 30px;
    width: 30px;
    border-radius: 100%;
    line-height: 30px;
    background-color: @icon-option;
    opacity: 1;
    margin-top: -15px;
    font-size: 14px!important;
  }
</style>