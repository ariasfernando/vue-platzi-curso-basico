<template>
  <settings-container label="Width" class="has-addons">
    <template slot="setting-right">
      <el-button
        v-if="autoWidth"
        class="control control--left is-expanded"
        size="mini"
        disabled
        @click="toggleAutoWidth">auto</el-button>

      <el-input-number
        v-else
        v-model="width"
        class="control control--left is-expanded"
        size="mini"
        :step="1"
        :min="1" />

      <el-button
        size="mini"
        class="control control--right is-clickable"
        :class="{'el-icon-setting is-default': autoWidth,'is-active': !autoWidth}"
        @click="toggleAutoWidth">
        <span v-if="!autoWidth">px</span>
      </el-button>
    </template>
  </settings-container>
</template>
<script>
import _ from 'lodash';
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'ButtonWidth',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  computed: {
    width: {
      get() {
        return this.element.attribute.width;
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: 'button',
          link: 'attribute',
          name: 'width',
          value: newValue,
        });
      },
    },
    autoWidth: {
      get() {
        return this.element.styleOption.autoWidth;
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: 'autoWidth',
          value: newValue,
        });
      },
    },
  },
  methods: {
    toggleAutoWidth() {
      this.autoWidth = !this.autoWidth;
    },
  },
};
</script>
<style lang="scss" scoped>
.settings-container.has-addons /deep/ .half-setting {
  display: flex;
  .el-button {
    transition: unset;
    &--mini,
    &--mini.is-round {
      padding: 7px;
    }
  }
  .el-input {
    &-number {
      width: 100%;
      .el-input__inner {
        text-align: center;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
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
          color: #78dcd6;
          &:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled),
          &:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled) {
            border: 1px solid #78dcd6;
          }
        }
      }
    }
  }
  .control {
    height: 28px;
    &--left {
      border-bottom-right-radius: 0px;
      border-top-right-radius: 0px;
      border-right: 0px;
      .el-input-number__increase {
        border-radius: 0px;
      }
    }
    &--right {
      width: 28px;
      border-radius: 0px 2px 2px 0px;
      margin-left: 0px;
      padding: 4px 0;
      flex-shrink: 0;
      &:focus {
        color: #606266;
      }
      &:hover {
        color: #78dcd6;
      }
    }
    &.is-expanded {
      flex-grow: 1;
      border-right: 0px;
    }
    &.is-disabled,
    &.is-disabled:focus,
    &.is-disabled:hover {
      color: #666666;
      cursor: auto;
    }
    &.is-default {
      background: #f8f8f8;
      border: 1px solid #dcdfe6;
      font-size: 11px;
      font-weight: 300;
      line-height: 14px;
    }
    &.is-active {
      background-color: #78dcd6;
      font-weight: 300;
      color: #ffffff;
      border: 1px solid #78dcd6;
    }
    &.is-clickable {
      cursor: pointer;
    }
  }
}
</style>
