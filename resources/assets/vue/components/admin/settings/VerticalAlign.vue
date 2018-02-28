<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="half">Vertical align</label>
    <el-button plain size="mini" @click="changeAlignment('top')" class="fa fa-arrow-up" :class="{ active: valign === 'top' }"></el-button>
    <el-button plain size="mini" @click="changeAlignment('middle')" class="fa fa-minus" :class="{ active: valign === 'middle' }"></el-button>
    <el-button plain size="mini" @click="changeAlignment('bottom')" class="fa fa-arrow-down" :class="{ active: valign === 'bottom' }"></el-button>
  </div>
</template>

<script>
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "VerticalAlign",
  props: ["setting", "element"],
  mixins: [ SettingMixin ],
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
        this.$emit("attribute-setting-updated", { name: this.name, value: newValue });
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
  width: 34px;
  padding: 4px 4px;
  margin: 2.5px 9px 2.5px 3.5px;
  height: 32px;
  display: block;
  float: left;
}
.padding-zero {
  padding: 0;
}
</style>
