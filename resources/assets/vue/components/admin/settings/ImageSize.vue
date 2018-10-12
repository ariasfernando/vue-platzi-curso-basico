<template>
  <div>
    <settings-container label="Image Size" class="is-normal-setting">
      <template slot="setting-right">
        <el-button class="cog-left" size="mini" disabled>
          {{ !isPxWidth ? 'Full Width' : 'Custom' }}
        </el-button>
        <el-button
          size="mini"
          class="el-icon-setting cog-right"
          :class="{'is-active': isPxWidth}"
          @click="onTogglePxWidth" />
      </template>
    </settings-container>

    <settings-container
      v-if="isPxWidth"
      label-right="Height (px)"
      label-left="Width (px)"
      class="is-advanced-setting">
      <template slot="setting-half-left">
        <el-input-number
          v-model="width"
          class="generic-number"
          size="mini"
          :min="min"
          :max="maxValueWidth" />
        <span class="height-icon-auto" @click="onToggleBlockheight">
          <i v-if="isBlockHeight" class="fa fa-lock" />
          <i v-else class="fa fa-unlock" />
        </span>
      </template>
      <template slot="setting-half-right">
        <el-input-number
          v-if="!isBlockHeight"
          v-model="height"
          class="generic-number"
          size="mini"
          :min="min" />
        <el-input
          v-else
          v-model="height"
          size="mini"
          class="clearfix"
          disabled="disabled" />
      </template>
    </settings-container>
  </div>
</template>
<script>
import _ from 'lodash';
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'ImageSize',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  data() {
    return {
      min: this.minValue ? this.minValue : 10,
    };
  },
  computed: {
    isBlockHeight: {
      get() {
        return this.element.styleOption.isBlockHeight;
      },
      set(value) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: 'isBlockHeight',
          value,
        });
      },
    },
    isPxWidth: {
      get() {
        return this.element.styleOption.isPxWidth;
      },
      set(value) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: 'isPxWidth',
          value,
        });
      },
    },
    width: {
      get() {
        return _.parseInt(this.element.attribute.width);
      },
      set(value) {
        value = isNaN(value) || value < this.min ? this.min : value;
        value =
          this.isDisablePercentage || this.isPxWidth ? `${value}` : '100%';
        this.$emit('setting-updated', {
          link: 'attribute',
          subComponent: this.subComponent,
          name: 'width',
          value,
        });
      },
    },
    height: {
      get() {
        return this.element.attribute.height === 'auto'
          ? 'auto'
          : _.parseInt(this.element.attribute.height);
      },
      set(value) {
        value =
          (isNaN(value) || value < this.min) && value !== 'auto'
            ? this.min
            : value;
        value = `${value}`;
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'attribute',
          name: 'height',
          value,
        });
      },
    },
    maxValueWidth() {
      return this.isPxWidth ? undefined : 100;
    },
  },
  watch: {
    element: {
      handler() {
        this.defineStyleOption();
      },
      deep: true,
    },
  },
  mounted() {
    this.defineStyleOption();
  },
  methods: {
    onTogglePxWidth() {
      if (!this.isDisablePercentage) {
        const isPxWidth = !this.isPxWidth;
        let width;
        if (!isPxWidth) {
          width = Math.min(100, this.width);
          // set height to auto;
          if (!this.isBlockHeight) {
            this.height = 'auto';
            this.isBlockHeight = !this.isBlockHeight;
          }
        }

        this.isPxWidth = isPxWidth;
        this.width = width;
      }
    },
    onToggleBlockheight() {
      const isBlockHeight = !this.isBlockHeight;
      if (isBlockHeight) {
        this.height = 'auto';
      } else {
        this.height = '100';
      }
      this.isBlockHeight = isBlockHeight;
    },
    defineStyleOption() {
      // set styleOption to default if is undefined
      if (this.element.styleOption['isBlockHeight'] === undefined) {
        this.isBlockHeight = false;
      }
      if (this.element.styleOption['isPxWidth'] === undefined) {
        if (this.isDisablePercentage) {
          this.isPxWidth = true;
        } else {
          this.isPxWidth = false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.el-button {
  &.is-disabled,
  &.is-disabled:focus,
  &.is-disabled:hover {
    color: #666666;
    cursor: auto;
  }
}

.height-icon-auto {
  position: absolute;
  left: 100%;
  margin-top: 0;
  padding: 0;
  height: 26px;
  width: 30px;
  text-align: center;
  padding-top: 4px;
  z-index: 2;
  bottom: 0;
  cursor: pointer;
  i {
    color: #666666;
  }
}

// normal settings
.cog-left {
  width: calc(100% - 28px);
  float: left;
  display: block;
  border-right: 0;
}

.cog-right {
  background: #f8f8f8;
  color: #666666;
  cursor: inherit;
  border: 1px solid #dcdfe6;
  font-size: 11px;
  font-weight: 300;
  line-height: 14px;
  border-radius: 0px 2px 2px 0px;
  height: 28px !important;

  &:hover {
    color: #78dcd6;
  }
}

.is-normal-setting {
  .el-button {
    transition: unset;
    border-radius: 2px;
    &.is-active {
      background-color: #78dcd6;
      padding: 7px 4px;
      font-weight: 300;
      color: #ffffff;
      border: 1px solid #78dcd6;
      border-radius: 0px 2px 2px 0px;
      height: 28px !important;
    }
    &--mini,
    &--mini.is-round {
      padding: 7px;
    }
    & + .el-button {
      margin-left: 0;
    }
    &.cog-right {
      width: 28px;
      padding: 4px 0;
      height: 26px;
      display: block;
      float: left;
    }
  }
}

// advanced settings
.is-advanced-setting {
  .button input {
    text-align: center;
  }
  .el-button {
    position: absolute;
    right: 0;
    padding: 6px;
    font-size: 11px;
    font-weight: 300;
    line-height: 14px;
    background: #f8f8f8;
    color: #666666;
    border-radius: 0px 2px 2px 0px;
    height: 28px !important;
    width: 28px !important;
    &.is-disabled,
    &.is-disabled:focus,
    &.is-disabled:hover .el-button--default {
      background: #f8f8f8;
      border: 1px solid #dcdfe6;
      font-size: 11px;
      font-weight: 300;
      line-height: 14px;
      border-radius: 0px 2px 2px 0px;
    }
  }
  & /deep/ .half-setting {
    text-align: left;
    position: relative;
    width: calc(50% - 15px);
    &--right {
      float: right;
      padding-left: 0px;
    }
    .generic-number {
      margin-top:5px;
    }
  }
  & /deep/ .el-input {
    &-number {
      width: 100%;
      .el-input_inner {
        &:focus {
          border: 1px solid #78dcd6;
        }
      }
      .el-input-number__decrease {
        border-radius: 2px 0px 0px 2px;
      }
      .el-input-number__increase {
        border-radius: 0px 2px 2px 0px;
      }
      .el-input-number__decrease,
      .el-input-number__increase {
        background: #f8f8f8;
        &:hover {
          color:#78dcd6;
          &:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled),
          &:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled) {
            border: 1px solid #78dcd6;
          }
        }
      }
    }
  }
}
</style>
