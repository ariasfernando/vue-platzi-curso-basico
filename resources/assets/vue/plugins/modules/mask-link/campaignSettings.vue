<template>
  <settings-container class="field-font-family" :label="plugin.title">
    <template slot="setting-bottom">
      <el-input
          name="mask_description"
          size="mini"
          placeholder="Mask Tag"
          v-model="mask_description"
          :class="{'input': true, 'is-danger': errors.has('mask_description') }"></el-input>
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";

export default {
  props: ["name", "plugin", "moduleDataIndex", "moduleDataKey"],
  components: { SettingsContainer },
  computed: {
    currentCustomModule() {
      return this.$store.getters["campaign/currentCustomModule"];
    },
    module() {
      return this.$store.getters["campaign/modules"][this.currentCustomModule];
    },
    mask_description: {
      get() {
        if (!_.isEmpty(this.currentComponent) && this.component) {
          console.log('1 getting dataDescription this.component[this.plugin.subComponent].attribute.dataDescription', this.component[this.plugin.subComponent].attribute.dataDescription);
          return this.component[this.plugin.subComponent].attribute.dataDescription || '';
        } else if (typeof this.moduleDataIndex != 'undefined' || typeof this.moduleDataKey != 'undefined') {
          console.log('2 getting dataDescription this.module.data[this.moduleDataKey][this.moduleDataIndex].dataDescription', this.module.data[this.moduleDataKey][this.moduleDataIndex].dataDescription);
          return this.module.data && !_.isUndefined(this.module.data[this.moduleDataKey]) && !_.isUndefined(this.module.data[this.moduleDataKey][this.moduleDataIndex])
            ? this.module.data[this.moduleDataKey][this.moduleDataIndex].dataDescription
            : null;
        } else {
          console.log('3 getting dataDescription this.module.data[\'dataDescription\']', this.module.data['dataDescription']);
          return this.module.data && this.module.data['dataDescription'] ? this.module.data['dataDescription'] : null;
        }
      },
      set(value) {
        console.log('setting dataDescription', value);
        this.saveComponentProperty("dataDescription", value);
      },
    },
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
      switch (component.type) {
        case 'button-element':
          this.plugin.subComponent ='button';
          break;
        case 'image-element':
          this.plugin.subComponent ='container';
          break;
        case 'text-element':
          this.plugin.subComponent ='container';
          break;
        case 'divider-element':
          this.plugin.subComponent ='divider';
          break;
        default:
          break;
      }
      return component;
    }
  },
  data() {
    return {
      description: ""
    };
  },
  created() {
    console.log('this.component', this.component);
    if (_.has(this.component, 'plugins.destinationUrl.config.validations.url.selected')) {
      this.component.plugins.destinationUrl.config.validations.url.selected = 'url';
    }
  },
  methods: {
    saveComponentProperty(property, value) {
      value = value.replace(/[^a-zA-Z0-9_\[\]]/g, '');
      console.log('Por guardar maskLink.value', value);
      if (!_.isEmpty(this.currentComponent)) {
        const payload = {
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          subComponent: this.plugin.subComponent,
          link: "attribute",
          property,
          value: value
        };
        console.log('1 setting dataDescription campaign/saveComponentProperty', payload);
        this.$store.commit("campaign/saveComponentProperty", payload);
      } else if (typeof this.moduleDataIndex != 'undefined') {
        const data = JSON.parse(JSON.stringify(this.module.data));
        data[this.moduleDataKey][this.moduleDataIndex][property] = value;
        console.log('2 setting dataDescription campaign/saveCustomModuleData ', {moduleId: this.currentCustomModule, data});
        this.$store.commit('campaign/saveCustomModuleData', {
          moduleId: this.currentCustomModule,
          data,
        });
      } else {
        const data = {};
        data[property] = value;
        console.log('3 setting dataDescription campaign/saveCustomModuleData', {moduleId: this.currentCustomModule, data});
        this.$store.commit('campaign/saveCustomModuleData', {
          moduleId: this.currentCustomModule,
          data,
        });
      }
    }
  }
};
</script>
<style lang="less">
.plugin-wrapper-inner.plugin-background-color {
  .el-input--mini {
    width: 86px;
    padding: 6px 0 0 0;
  }
  .el-color-picker__trigger {
    padding: 3px;
    height: 28px;
    width: 34px;
    border-right: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 4px;
  }
  .el-color-picker {
    padding: 6px 0 0 0;
    float: left;
  }
  input.el-input__inner {
    text-align: center;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: transparent !important;
    color: #666666;
    cursor: auto;
    padding: 0;
    font-size: 12px !important;
    width: 87px !important;
    border: 1px solid #dcdfe6 !important;
  }
}
</style>
