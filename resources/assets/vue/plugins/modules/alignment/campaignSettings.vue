<template>
    <settings-container :label="plugin.title" v-if="component">
      <template slot="setting-right">
        <el-button
          v-for="option in options"
          plain
          size="mini"
          @click="changeAlignment(option)"
          :class="[`fa fa-align-${option}`,{ active: value === option }]"
          :data-tooltip="option"
          :key="option"
        ></el-button>
      </template>
    </settings-container>
</template>

<script>
  import _ from 'lodash';
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
  export default {
    props: ['name', 'plugin'],
    components: { SettingsContainer },
    data() {
      return {
        options: this.plugin.config.options
      }
    },
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      component() {
        let component = {};
        if (Object.keys(this.currentComponent).length !== 0) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          component = this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId];
        }
        return component;
      },
      value: {
        get() {
          return this.component[this.plugin.subComponent].attribute.align;
        },
        set(value) {
          const payload = {
            moduleId: this.currentComponent.moduleId,
            columnId: this.currentComponent.columnId,
            componentId: this.currentComponent.componentId,
            subComponent: this.plugin.subComponent,
            link: "attribute",
            property: "align",
            value: value
          };
          this.$store.commit('campaign/saveComponentProperty', payload);
        }
      },
    },
    methods: {
      changeAlignment(option) {
        this.value = option;
      },
    },
  }

</script>
<style lang="scss" scoped>
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
  width: 28px;
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
