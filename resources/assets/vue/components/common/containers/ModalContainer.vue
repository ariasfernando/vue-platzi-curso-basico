<template>
  <div class="modal-container-component">
    <div class="st-modal">
      <div class="row">
        <div class="col-sx-12">
          <div class="close-button" @click="$emit('close-modal')">X</div>
          <slot />
          <Button v-if="buttonSubmitText" class="button-submit-modal" @click="$emit('submit-modal')">{{ buttonSubmitText }}</Button>
          <Button v-if="buttonCloseText" class="button-close-modal" @click="$emit('close-modal')">{{ buttonCloseText }}</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LabelItemContainer',
  props: ['buttonCloseText', 'buttonSubmitText'],
};
</script>
<style lang="less" scoped>
.close-button {
  float: right;
  color: red;
  font-weight: 900;
  clear: both;
  cursor: pointer;
}
.button-close-modal {
    float: right;
}
.button-submit-modal {
    float: right;
}
.modal-container-component {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.37);
  z-index: 1000;

  > .st-modal {
    position: fixed;
    top: 10vh;
    left: 10vw;
    right: 10vw;
    background: white;
    padding: 2rem;
    border: 1px solid #f0f0f0;
  }
}
</style>
