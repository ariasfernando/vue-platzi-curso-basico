<template>
    <settings-container label="Vertical align">
      <template slot="setting-right">
        <el-button plain size="mini" @click="changeAlignment('top')" class="fa fa-arrow-up" :class="{ active: valign === 'top' }"></el-button>
        <el-button plain size="mini" @click="changeAlignment('middle')" class="fa fa-minus" :class="{ active: valign === 'middle' }"></el-button>
        <el-button plain size="mini" @click="changeAlignment('bottom')" class="fa fa-arrow-down" :class="{ active: valign === 'bottom' }"></el-button>
      </template>
    </settings-container>
</template>

<script>
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "VerticalAlign",
  props: ["setting", "element", "subComponent"],
  mixins: [ SettingMixin ],
  components: { SettingsContainer },
  data() {
    return {
      name: "valign"
    };
  },
  computed: {
    valign: {
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
      this.valign = newValue;
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
  padding: 4px 0px;
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
