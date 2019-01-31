<template>
  <div class="stui-field" :class="[rootClasses, fieldType()]">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'StuiField',
  props: {
    grouped: Boolean,
    groupMultiline: Boolean,
    position: {
      type: String,
      default: '',
    },
    expanded: Boolean,
    horizontal: Boolean,
    addons: {
      type: Boolean,
      default: true,
    },
    customClass: {
      type: String,
      default: '',
    },
  },
  computed: {
    rootClasses() {
      return [this.newPosition, {
        'is-expanded': this.expanded,
        'is-grouped-multiline': this.groupMultiline,
      }];
    },
    newPosition() {
      if (this.position) {
        const position = this.position.split('-');
        if (position.length < 1) return null;

        const prefix = this.grouped
          ? 'is-grouped-'
          : 'has-addons-';
        return prefix + position[1];
      }
      return null;
    },
  },
  methods: {
    /**
     * Field has addons if there are more than one slot
     * (element / component) in the Field.
     * Or is grouped when prop is set.
     */
    fieldType() {
      if (this.grouped) return 'is-grouped';
      let renderedNode = 0;
      if (this.$slots.default) {
        renderedNode = this.$slots.default.reduce(
          (i, node) => (node.tag ? i + 1 : i),
          0,
        );
      }
      if (renderedNode > 1 && this.addons) {
        return 'has-addons';
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.stui-field {
  clear: both;
  &:not(:last-child) {
    // @todo: padding and margins of stui-inputs should be managed here
  }
  // Modifiers
  &.has-addons {
    display: flex;
    justify-content: flex-start;
    .control {
      &:not(:last-child) {
        margin-right: -1px;
      }
      &:not(:first-child):not(:last-child) {
        .el-button,
        .el-input,
        .el-select select {
          border-radius: 0;
        }
      }
      &:first-child {
        .el-button,
        .el-input,
        .el-select{
          border-bottom-right-radius: 0;
          border-top-right-radius: 0;
        }
      }
      &:last-child {
        .el-button,
        .el-input,
        .el-select {
          border-bottom-left-radius: 0;
          border-top-left-radius: 0;
        }
      }
      &.is-expanded {
        flex-grow: 1;
      }
      .el-button,
      .el-input,
      .el-select {
        &:not([disabled]) {
          &:hover {
            z-index: 2;
          }
          &:focus,
          &:active,
          &.is-active,
          &.active {
            z-index: 3;
            &:hover {
              z-index: 4;
            }
          }
        }
      }
    }
    &.has-addons-centered {
      justify-content: center;
    }
    &.has-addons-right {
      justify-content: flex-end;
    }
    &.has-addons-fullwidth {
      .control {
        flex-grow: 1;
        flex-shrink: 0;
      }
    }
  }
  &.is-grouped {
    display: flex;
    justify-content: flex-start;
    & > .control {
      flex-shrink: 0;
      &:not(:last-child) {
        margin-bottom: 0;
        margin-right: 4px;
      }
      &.is-expanded {
        flex-grow: 1;
        flex-shrink: 1;
      }
    }
    &.is-grouped-centered {
      justify-content: center;
    }
    &.is-grouped-right {
      justify-content: flex-end;
    }
    &.is-grouped-multiline {
      flex-wrap: wrap;
      & > .control {
        &:last-child,
        &:not(:last-child) {
          margin-bottom: 4px;
        }
      }
      &:last-child {
        margin-bottom: -4px;
      }
      &:not(:last-child) {
        margin-bottom: 0;
      }
    }
  }
  &.is-horizontal {
    display: flex;
  }
  .control {
    clear: both;
    position: relative;
    text-align: left;
  }
}
</style>
