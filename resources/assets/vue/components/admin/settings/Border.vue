<template>
  <settings-container :label="`Border ${side}`" custom-class="field-border">
    <template slot="setting-bottom">
      <div class="clearfixalign-element">
        <el-color-picker
          v-model="color"
          color-format="hex"
          class="float-left margin-right" />
        <el-select
          v-model="style"
          :placeholder="`Border ${side} style`"
          size="mini"
          class="float-left margin-right">
          <el-option
            v-for="item in optionsBorderStyle"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
        <el-input-number
          v-model="width"
          v-validate="'required'"
          size="mini"
          :min="min"
          :controls="true"
          controls-position="right"
          class="float-left" />
        <el-button
          class="button float-left"
          disabled="disabled">
          px</el-button>
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
        { value: 'inherit', label: 'inherit' },
        { value: 'initial', label: 'initial' },
        { value: 'outset', label: 'outset' },
        { value: 'inset', label: 'inset' },
        { value: 'double', label: 'double' },
        { value: 'dashed', label: 'dashed' },
        { value: 'dotted', label: 'dotted' },
        { value: 'hidden', label: 'hidden' }
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
          if (this.color) {
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
        return this.element.style[`border${this.side}Color`] ? this.element.style[`border${this.side}Color`] : '';
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
.button input {
  text-align: center;
}
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  background: #f8f8f8;
  color: #666666;
  cursor: inherit;
  border: 1px solid #dcdfe6;
  font-size: 11px;
  font-weight: 300;
  line-height: 14px;
  border-radius: 0px 2px 2px 0px;
}
.input-number-size {
  padding-left: 0;
  padding-right: 21px;
}
.el-button.is-active .el-input__inner,
.el-input__inner:focus {
  border: 1px solid #dcdfe6;
}
button.el-button {
  padding: 6px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.el-color-picker {
  height: 30px;
}

.float-left {
  float: left;
}
.el-select {
  width: 100px;
}
.margin-right {
  margin-right: 5px;
}
.el-input-number {
  width: 67px;
}

.el-input-number.is-controls-right /deep/ .el-input__inner {
  border-radius: 2px 0px 0px 2px;
  padding-left: 8px;
  padding-right: 35px;
}

#edit-container .right-bar .form-group,
#edit-container .left-bar .form-group {
  margin-bottom: 0;
  &:last-of-type {
    margin-bottom: 6px;
  }
}
</style>
<style lang="less" >


.field-border {
  input[type='text'] {
    text-align: center;
  }
  .el-input-number.is-without-controls .el-input__inner {
    border-radius: 2px 0px 0px 2px;
    border-right: none;
  }
  .el-color-picker__trigger {
    padding: 0px;
    height: 28px;
    width: 34px;
    border-radius: 2px;

    .el-color-picker__color {
      border: none;
    }
  }
  .el-select {
    .el-input__inner {
      border-radius: 2px;

      &:focus {
        border: 1px solid #78dcd6;
      }
    }
  }
}
</style>
