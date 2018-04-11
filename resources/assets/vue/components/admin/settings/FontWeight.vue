<template>
    <settings-container custom-class="input-font-weight" label="Font Weight">
      <template slot="setting-right">
        <el-select
          v-if="isCustomFontWeight"
          class="custom-col"
          size="mini"
          :value="fontWeight"
          v-model="fontWeight"
          placeholder="Font Weight"
          >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-button
          class="custom-col"
          v-else
          size="mini"
          @click="toggleNormalBold"
        >{{fontWeight}}</el-button>

        <el-button
          size="mini"
          :class="{'el-icon-setting': true ,'active': isCustomFontWeight}"
          @click="toggleCustomFontWeight"
        ></el-button>
      </template>
    </settings-container>
</template>

<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "FontWeight",
  props: ["setting", "element"],
  mixins: [ SettingMixin ],
  components: { SettingsContainer },
  data() {
    return {
      name: "fontWeight",
      isCustomFontWeightName: "isCustomFontWeight",
      options: [],
    };
  },
  mounted() {
    function getOptions() {
      let options = [];
      let val = 100;
      for (; val < 901; ) {
        options.push({ value: val, label: val });
        val += 100;
      }
      return options;
    }
    this.options = getOptions();
  },
  computed: {
    isCustomFontWeight: {
      get() {
        return this.element.styleOptions[this.isCustomFontWeightName];
      },
      set(newValue) {
        this.$emit("setting-updated", {
          link:'styleOptions',
          name: this.isCustomFontWeightName,
          value: newValue
        });
      }
    },
    fontWeight: {
      get() {
        return this.element.style[this.name];
      },
      set(newValue) {
        this.$emit("setting-updated", {
          link:'style',
          name: this.name,
          value: newValue
        });
      }
    }
  },
  methods: {
    toggleCustomFontWeight() {
      // Saving value to temp variable because setter call to store is async
      let newValue = !this.isCustomFontWeight;
      this.isCustomFontWeight = newValue;

      this.fontWeight = !newValue ? "normal" : "500";
    },
    toggleNormalBold() {
      this.fontWeight = this.fontWeight === "normal" ? "bold" : "normal";
    }
  }
};
</script>
<style lang="less" scoped>
.el-icon-setting.active {
  background-color: #78dcd6;
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 7px;
}
.el-select {
  padding: 0;
}
.custom-col {
  width: calc(~"100% - 28px");
  float: left;
  display: block;
  border-right: 0;
}
.el-button + .el-button {
  margin-left: 0;
}
.el-button:not(.custom-col) {
  width: 28px;
  padding: 4px 0;
  height: 28px;
  display: block;
  float: left;
}
</style>
<style>
/* not scoped */
.input-font-weight .el-input--mini .el-input__inner {
  text-align: center;
  border-right: 0;
}
</style>

