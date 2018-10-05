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
  mixins: [SettingMixin],
  components: { SettingsContainer },
  data() {
    return {
      linkName: "align"
    };
  },
  computed: {
    align: {
      get: function() {
        return this.element.attribute[this.linkName];
      },
      set: function(newValue) {
        this.$emit("setting-updated", {
          subComponent: this.subComponent,
          link:'attribute',
          name: this.linkName,
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
<style lang="scss" scoped>
.settings-container{
  // Hack inline-block
  font-size: 0;
}
.el-button:focus,
.el-button:hover {
  color: inherit;
  border-color: #78dcd6;
  background-color: inherit;
}
.el-button.active {
  color: #ffffff;
  border-color: rgb(120, 220, 214);
  background-color: rgb(120, 220, 214);

  &:before{
    color: #ffffff;
  }
}
.el-button + .el-button {
  margin-left: 0;
}
.el-button {
  width: 33%;
  padding: 4px 0;
  margin-right: 0px;
  height: 26px;
  border-radius: 0px;
  border-right: none;

  &:before{
    color: #999999;
  }

  &:first-of-type {
    margin: 0;
    border-radius: 2px 0px 0px 2px;
    border-right: none;
  }

  &:last-of-type {
    margin: 0;
    border-radius: 0px 2px 2px 0px;
    border-right: 1px solid #dddddd;
  }
}
.el-button:first-child:nth-last-child(2),
.el-button:first-child:nth-last-child(2) ~ button {
    width: 50%;
}
.el-button:first-child:nth-last-child(3),
.el-button:first-child:nth-last-child(3) ~ button {
    width: 33%;
}
.el-button:first-child:nth-last-child(4),
.el-button:first-child:nth-last-child(4) ~ button{
    width: 25%;
}
.padding-zero {
  padding: 0;
}
</style>
