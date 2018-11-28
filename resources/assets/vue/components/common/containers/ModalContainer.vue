<template>
  <div class="modal-container-component">
    <el-row type="flex">
      <el-col>
        <stui-close @click="$emit('close-modal')" />
        <h4 v-if="title" class="modal-title">{{ title }}</h4>
        <slot />
        <div class="modal-container-footer">
          <stui-button v-if="buttonSubmitText" class="button-close-modal" type="primary" @click="$emit('submit-modal')">{{ buttonSubmitText }}</stui-button>
          <stui-button v-if="buttonCloseText" class="button-close-modal" type="primary" @click="$emit('close-modal')">{{ buttonCloseText }}</stui-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'ModalContainer',
  props: ['buttonCloseText', 'buttonSubmitText', 'title'],
};
</script>
<style lang="scss" scoped>
.button-close-modal {
  float: right;
}
.button-submit-modal {
  float: right;
}
.modal-title {
  font-size: 20px;
  font-weight: 300;
  color: #666;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 7px;
  margin-bottom: 20px;
  margin-top: 0;
  line-height: 1.1;
}
.modal-container-component {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.37);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  > .el-row {
    width: 1160px !important;
    min-height: 450px;
    overflow: hidden;
    margin: 0 auto;
    background-color: #fff;
    padding: 25px;
    max-height: 90vh;
  }
}
.modal-container-footer {
  padding: 25px 0px 0px 0px;
  border-top: 1px solid #DDDDDD;
}
</style>
