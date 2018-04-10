<template>
    <settings-container label="Horizontal align">
      <template slot="setting-right">
        <el-button plain size="mini" @click="changeAlignment('left')" class="fa fa-align-left" :class="{ active: align === 'left' }"></el-button>
        <el-button plain size="mini" @click="changeAlignment('center')" class="fa fa-align-center" :class="{ active: align === 'center' }"></el-button>
        <el-button plain size="mini" @click="changeAlignment('right')" class="fa fa-align-right" :class="{ active: align === 'right' }"></el-button>
        <el-button plain size="mini" @click="changeAlignment('justify')" class="fa fa-align-justify" :class="{ active: align === 'justify' }"></el-button>
      </template>
    </settings-container>
</template>


<script>
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "TextAlign",
  props: ["setting", "element", "subComponent"],
  mixins: [SettingMixin],
  components: { SettingsContainer },
  data() {
    return {
      name: "align"
    };
  },
  computed: {
    align: {
      get: function() {
        return this.element.attribute[this.name];
      },
      set: function(newValue) {
        this.$emit("setting-updated", {
          subComponent: this.subComponent,
          link:'attribute',
          name: this.name,
          value: newValue
        });
      }
    }
  },
  methods: {
    changeAlignment(newValue) {
      this.align = newValue;
    }
  }
};
</script>
<style lang="less" scoped>
.el-button:focus,
.el-button:hover {
  color: inherit;
  border-color: inherit;
  background-color: inherit;
}
.el-button.active {
  color: #ffffff;
  border-color: rgb(120, 220, 214);
  background-color: rgb(120, 220, 214);
}
.el-button + .el-button {
  margin-left: 0;
}
.el-button {
  width: 28px;
  padding: 4px 0;
  margin-right: 2.67px;
  height: 26px;
  display: block;
  float: left;
  &:last-of-type {
    margin: 0;
  }
}
.padding-zero {
  padding: 0;
}
</style>
