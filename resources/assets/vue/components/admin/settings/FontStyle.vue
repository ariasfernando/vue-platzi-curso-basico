<template>
  <settings-container label-left="Font Size" label-right="Line Height">
    <template slot="setting-half-left">
      <el-input-number
        size="mini" 
        v-validate="'required'"
        v-model="fontSize"
        :value="fontSize"
        :class="{'clearfix': true, 'is-danger': errors.has('fontSize') }"
        :min="5"
        :max="50"
      ></el-input-number>
      <span class='icon-block-line-height' @click="toggleLineHeight">
        <i v-if="isBlockLineHeight" class="fa fa-lock"></i>
        <i v-else class="fa fa-unlock"></i>
      </span>
    </template>
    <template slot="setting-half-right">
      <el-input-number
        size="mini" 
        v-validate="'required'"
        v-model="lineHeight"
        :value="lineHeight"
        :class="{'clearfix': true, 'is-danger': errors.has('lineHeight') }"
        :min="6"
        :max="60"
        :disabled="isBlockLineHeight"
      ></el-input-number>
    </template>
  </settings-container>
</template>
<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "font-style",
  mixins: [ SettingMixin ],
  components: { SettingsContainer },
  mounted() {
    // set styleOption to default if is undefined
    this.element.styleOption["isBlockLineHeight"] === undefined ? this.isBlockLineHeight = false : '';
  },
  computed: {
    isBlockLineHeight: {
      get() {
        return this.element.styleOption["isBlockLineHeight"];
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: "isBlockLineHeight",
          value: newValue
        });
      }
    },
    fontSize: {
      get() {
        return _.parseInt(this.element.style["fontSize"]);
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'style',
          name: "fontSize",
          value: newValue + "px"
        });
        
        if (this.isBlockLineHeight) {
          this.lineHeight = this.calculateLineHeight(newValue);
        }
      }
    },
    lineHeight: {
      get() {
        return _.parseInt(this.element.style["lineHeight"]);
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'style',
          name: "lineHeight",
          value: newValue + "px"
        });
      }
    }
  },
  methods: {
    calculateLineHeight(fontSize) {
      return Math.round(fontSize * 1.2);
    },
    toggleLineHeight() {
      this.isBlockLineHeight = !this.isBlockLineHeight;
      this.lineHeight = this.calculateLineHeight(this.fontSize);
    }
  }
};
</script>
<style lang="less" scoped>
.icon-block-line-height {
  position: absolute;
  right: -15px;
  margin-top: 0;
  padding: 0;
  height: 28px;
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

.el-input-number {
  width: 105px;
}
</style>
