<template>
  <settings-container :label="`${side} (px)`" custom-class="field-border">
    <template slot="setting-bottom">
      <div class="clearfix">
        <stui-field grouped>
          <div class="control border-number">
            <stui-input-number
              v-model="width"
              v-validate="'required'"
              :min="min" />
          </div>
          <div class="control is-expanded">
            <div class="border-style-preview">
              <div
                class="preview"
                :class="`is-${style}`"
                :style="`border-style: ${style}`" />
            </div>
            <stui-select
              v-model="style"
              size="mini"
              class="control-item hide-input"
              :list="optionsBorderStyle" />
          </div>
          <div class="control is-half">
            <stui-color-picker v-model="color" />
          </div>
        </stui-field>
      </div>
    </template>
  </settings-container>
</template>
<script>
import _ from 'lodash';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'Border',
  components: { SettingsContainer },
  props: ['side', 'element'],
  data() {
    return {
      min: 0,
      optionsBorderStyle: [
        { value: 'none', label: 'none' },
        { value: 'solid', label: 'solid' },
        { value: 'dashed', label: 'dashed' },
        { value: 'dotted', label: 'dotted' },
        { value: 'double', label: 'double' },
        { value: 'hidden', label: 'hidden' },
        { value: 'inherit', label: 'inherit' },
        { value: 'initial', label: 'initial' },
        { value: 'outset', label: 'outset' },
        { value: 'inset', label: 'inset' },
      ],
    };
  },
  computed: {
    width: {
      get() {
        return _.parseInt(this.element.style[`border${this.side}Width`]);
      },
      set(width) {
        const value = isNaN(width) || width < this.min ? this.min : width;
        if (value > 0) {
          if (this.style === 'none') {
            this.style = 'solid';
          }
          if (!this.color) {
            this.color = '#000000';
          }
        }
        this.$emit('setting-updated', {
          link: 'style',
          name: `border${this.side}Width`,
          value: `${value}px`,
        });
      },
    },
    style: {
      get() {
        return this.element.style[`border${this.side}Style`] || 'none';
      },
      set(style) {
        this.$emit('setting-updated', {
          link: 'style',
          name: `border${this.side}Style`,
          value: style,
        });
      },
    },
    color: {
      get() {
        return this.element.style[`border${this.side}Color`]
          ? this.element.style[`border${this.side}Color`]
          : '';
      },
      set(color) {
        let value = color;
        if (!Application.utils.validateHexVal(color)) {
          value = color === null ? '' : Application.utils.rgbToHex(color);
        }
        this.$emit('setting-updated', {
          link: 'style',
          name: `border${this.side}Color`,
          value,
        });
      },
    },
  },
};
</script>
<style lang='scss' scoped>
@import '../../../stensul-ui/scss/stui.scss';
.control.is-half {
  width: calc(50% - 4px);
}
.border-number {
  width:50px;
}
.border-style-preview {
  position: absolute;
  left: 3px;
  z-index: 1;
  top: 2px;
  bottom: 2px;
  right: 26px;
  background: #fff;
  pointer-events: none;
  .preview {
    position: absolute;
    top: 50%;
    left: 5px;
    right: 5px;
    transform: translateY(-50%);
    border-width: 3px 0 0 0;
    border-color: $stui-label-color;
    font-size: 11px;
    &.is-none:after {
      content: "none";
      display: block;
    }
    &.is-inherit:after {
      content: "inherit";
      display: block;
    }
    &.is-hidden:after {
      content: "hidden";
      display: block;
    }
    &.is-initial:after {
      content: "initial";
      display: block;
    }
  }
}
.hide-input /deep/ .el_input .el-input__inner {
  background-color: transparent;
  text-indent: 999px;
}
</style>
