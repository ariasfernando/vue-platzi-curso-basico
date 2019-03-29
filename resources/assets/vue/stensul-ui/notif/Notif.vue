<template>
  <div
    class="stui-notif"
    :class="{'is-danger': value.type === 'error'}">
    {{ value.msg }}
  </div>
</template>
<script>
export default {
  name: 'StuiNotif',
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../scss/stui.scss';
.stui-notif {
  font-size: 10px;
  font-weight: 300;

  &.is-danger {
    color: $stui-color-danger;
  }
}
</style>

