<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="half">Horizontal align</label>
    <div class="half-style-setting padding-top">
      <el-button plain size="mini" @click="changeAlignment('left')" class="fa fa-align-left" :class="{ active: align === 'left' }"></el-button>
      <el-button plain size="mini" @click="changeAlignment('center')" class="fa fa-align-center" :class="{ active: align === 'center' }"></el-button>
      <el-button plain size="mini" @click="changeAlignment('right')" class="fa fa-align-right" :class="{ active: align === 'right' }"></el-button>
    </div>
  </div>
</template>

<script>
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "TextAlign",
  props: ["setting"],
  mixins: [SettingMixin],
  data() {
    return {
      name: "align"
    };
  },
  computed: {
    align: {
      get: function() {
        return this.component.attribute[this.name];
      },
      set: function(newValue) {
        this.$emit("attribute-setting-updated", {
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
  width: 34px;
  padding: 4px 4px;
  margin-right: 9px;
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
