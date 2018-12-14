<template>
  <div class="component-toolbar">
    <div class="icon move">
      <i class="glyphicon glyphicon-move" />
    </div>
    <div class="icon remove st-remove" @click="removeComponent">
      <i class="glyphicon glyphicon-trash st-remove" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentToolbar',
  props: ['elementId'],
  methods: {
    removeComponent() {
      this.$store.commit('module/clearCurrentComponent');
      this.$store.commit('module/removeElement', {
        elementId: this.elementId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../stensul-ui/scss/stui.scss';
.icon {
  position: absolute;
  height: 22px;
  width: 22px;
  top: -23px;
  background-color: #78dcd6;
  text-align: center;
  color: #fff;
  line-height: 25px;
  font-size: 11px !important;
  z-index: 5;
}
.move {
  right: 21px;
  cursor: move;
}
.remove {
  right: -1px;
}
.component-toolbar {
  position: relative;
}
</style>
