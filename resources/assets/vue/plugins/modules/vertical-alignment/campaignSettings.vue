<template>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
        <el-button plain size="mini" @click="changeAlignment('top')" class="glyphicon glyphicon-object-align-top" :class="{ active: value === 'top' }"></el-button>
        <el-button plain size="mini" @click="changeAlignment('middle')" class="glyphicon glyphicon-object-align-horizontal" :class="{ active: value === 'middle' }"></el-button>
        <el-button plain size="mini" @click="changeAlignment('bottom')" class="glyphicon glyphicon-object-align-bottom" :class="{ active: value === 'bottom' }"></el-button>
      </template>
    </settings-container>
</template>

<script>
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
  export default {
    props: ['name', 'plugin', 'moduleId', 'columnId'],
    components: { SettingsContainer },
    computed: {
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      column() {
        return this.modules[this.moduleId].structure.columns[this.columnId];
      },
      value() {
        return this.column.container.attribute.valign;
      }
    },
    data() {
      return {
        options: this.plugin.config.options
      }
    },
    methods: {
      changeAlignment(value) {
        const payload = {
          moduleId: this.moduleId,
          columnId: this.columnId,
          subComponent: 'container',
          link: "attribute",
          property: "valign",
          value: value
          };

        this.$store.commit('campaign/saveColumnProperty', payload);
      }
    },
  }
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
