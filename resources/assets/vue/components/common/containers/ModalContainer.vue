<template>
  <div class="modal-container-component">
    <el-row type="flex">
      <el-col>
        <stui-close @click="$emit('close-modal')" />
        <h4 v-if="title" class="modal-header-text modal-title">{{ title }}</h4>
        <h5 v-if="subtitle" class="modal-header-text">{{ subtitle }}</h5>
        <div class="slot-container">
          <slot />
        </div>
        <div class="modal-container-footer">
          <stui-button v-if="buttonSubmitText" class="button-close-modal" type="primary" @click="$emit('submit-modal')">{{ buttonSubmitText }}</stui-button>
          <stui-button v-if="buttonCloseText" class="button-close-modal" :type="buttonSubmitText ? 'default' : 'primary'" :class="buttonSubmitText ? 'btn-divider' : ''" @click="$emit('close-modal')">{{ buttonCloseText }}</stui-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'ModalContainer',
  props: ['buttonCloseText', 'buttonSubmitText', 'title', 'subtitle'],
};
</script>
<style lang="scss" scoped>
.button-close-modal {
  float: right;
}
.button-submit-modal {
  float: right;
}
.btn-divider {
  margin-right: 10px;
}
.modal-header-text {
  color: #666;
  line-height: 1.1;
  display: inline;
}
.modal-title {
  font-size: 20px;
  font-weight: 300;
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
    overflow: auto;
    margin: 0 auto;
    background-color: #fff;
    padding: 25px;
    max-height: 90vh;
  }
}
.slot-container {
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #DDDDDD;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-top: 22px;
  padding-bottom: 22px;
  overflow: auto;
  max-height: 90%;
  min-height: 80%;
}
</style>
