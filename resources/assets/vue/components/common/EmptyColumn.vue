<template>
  <tr>
    <td :style="styles" class="empty-column">
      <p class="empty-col">
        Drag content here
      </p>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'EmptyColumn',
  props: ['styles'],
};
</script>

<style lang="scss" scoped>
@import '../../stensul-ui/scss/stui.scss';
.empty-column {
  position: absolute;
  background-color: lighten($color-secondary, 30%);
  pointer-events: none;
  p {
    text-align: center;
    font-size: 13px;
    font-weight: normal;
    color: #78dcd6;
    transform: translateY(-50%);
    top: 50%;
    position: absolute;
    left: 0;
    right: 0;
    color: $color-secondary;
  }
}
</style>
