<template>
  <div>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
            <toggle-button :value="plugin.enabled" @change="toggle"></toggle-button>
      </template>
    </settings-container>

    <div class="btn-group" v-if="plugin.enabled">
      <el-button
        v-for="(option, name) in plugin.config.options"
        :class="[option.icon , {'active': option.value}]"
        :title="option.label"
        v-b-tooltip.hover
        :data-tooltip="option.label"
        size="mini"
        @click.prevent="toggleOption(name,option.value)"
        :key="name"
      ></el-button>
    </div>
    <div class="clearfix" v-if="plugin.config.options.forecolor.value">
      <settings-container v-if="!plugin.config.options.forecolor.textcolor_from_library" label="textcolor_map">
        <template slot="setting-right">
          <el-input
            size="mini"
            v-validate="'required'"
            v-model="textColorMap"
            placeholder="000000,Black,474646,Gray,79a8c9,Blue,cd202c,Red"
            class="clearfix"
          ></el-input>
        </template>
      </settings-container>
    </div>
    <div class="clearfix" v-if="plugin.config.options.forecolor.value">
      <settings-container label="textcolor_from_library">
        <template slot="setting-right">
          <toggle-button
            :value="plugin.config.options.forecolor.textcolor_from_library"
            @change="newValue => changeOption(newValue,'textcolor_from_library','forecolor')"
          ></toggle-button>
      </template>
      </settings-container>
      <settings-container v-if="plugin.config.options.forecolor.textcolor_from_library" label="palette_name">
        <template slot="setting-right">
          <el-input
            size="mini"
            v-validate="'required'"
            v-model="palette_name"
            placeholder="name"
            class="clearfix"
          ></el-input>
        </template>
      </settings-container>
    </div>
    <div class="clearfix" v-for="(tinySetting, key) in plugin.config.settings" v-if="plugin.enabled" :key="key">
      <settings-container :label="tinySetting.title" >
        <template slot="setting-right">
          <toggle-button :value="tinySetting.value" @change="(newValue)=>toggleSetting(newValue, key)"></toggle-button>
        </template>
      </settings-container>

      <!-- Input if config needs it -->
      <div v-if="isAValidSetting(tinySetting ,key)">
          <el-input-number
            v-if="tinySetting.type === 'number'"
            size="mini"
            v-b-tooltip.hover
            :title="key"
            :name="key"
            @change="(value)=>changeSetting(value, key)"
            :value="tinySetting.content || 0"
            :min="0"
          ></el-input-number>
          <el-input
            v-if="tinySetting.type === 'text'"
            size="mini"
            v-b-tooltip.hover
            :title="key"
            :name="key"
            @change="(value)=>changeSetting(value, key)"
            :value="tinySetting.content || 0"
          ></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";

export default {
  props: ["name"],
  components: { SettingsContainer },
  computed: {
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    module() {
      return this.$store.getters["module/module"];
    },
    plugin() {
      const module = this.module,
        columnId = this.currentComponent.columnId,
        componentId = this.currentComponent.componentId;

      const plugin =
        module.structure.columns[columnId].components[componentId].plugins[
          this.name
        ];
      this.enabled = plugin.enabled;
      this.options = plugin.config.options;

      return plugin;
    },
    textColorMap: {
      get() {
        return this.plugin.config.options.forecolor.textcolor_map.join(',');
      },
      set(value) {
        this.changeOption(value.split(","),'textcolor_map','forecolor');
      },
    },
    palette_name: {
      get() {
        return this.plugin.config.options.forecolor.palette_name;
      },
      set(value) {
        this.changeOption(value,'palette_name','forecolor');
      }
    },
  },
  data() {
    return {
      enabled: false,
      options: {}
    };
  },
  methods: {
    toggle(value) {
      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        enabled: value
      };
      // Update state of the component
      this.$store.commit("module/togglePlugin", payload);

      // Set current component
      this.$store.commit("module/setCurrentComponent", {
        columnId: payload.columnId,
        componentId: payload.componentId
      });
      // Update component view in the third column
      this.$store.commit("module/setChangeSettingComponent", {
          style: this.module.structure.columns[payload.columnId].components[payload.componentId].style || {},
          attribute: this.module.structure.columns[payload.columnId].components[payload.componentId].attribute || {}
      });
    },

    toggleOption(name, oldValue) {
      const value = !oldValue;
      const options = {};
      options[name] = {
        value: value
      };

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config: {
          options
        }
      };

      // Save plugin data
      this.$store.commit("module/savePlugin", payload);
    },

    toggleSetting(value, setting) {
      const options = {};
      let content;

      // if toogle is disabled the inputs value will be 0
      if (value == false) {
        content = 0;
      }
      options[setting] = {
        value,
        content
      };

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config: {
          settings: options
        }
      };

      // Save plugin data
      this.$store.commit("module/savePlugin", payload);
    },

    changeSetting(value,settingName) {
      const setting = {};
      // switch to other var because value saved toggle state.
      const content = value;

      setting[settingName] = {
        content
      };

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config: {
          settings: setting
        }
      };

      this.$store.commit("module/savePlugin", payload);
    },

    changeOption(value,setting,subOption) {
      const option = {};
      option[subOption] = {};
      option[subOption][setting] = value;

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config: {
          options: option
        },
        subOption: subOption
      };

      // Save plugin data
      this.$store.commit("module/savePluginSuboption", payload);
    },
    isAValidSetting(tinySetting, key) {
      return (['truncate', 'lines_limit', 'fontsize_formats', 'style_formats', 'link_fixed_color'].indexOf(key) !== -1) && tinySetting.value === true;
    },
  }
};
</script>
<style lang="less" scoped>
.font-mce-ico {
  font-family: tinymce, Arial;
}
.mce-i-forecolor:before {
  border-bottom: 2px solid #333;
  margin-top: 2px;
}
.mce-i-backcolor:before {
  padding: 4px;
  background: #bbb;
}
.btn-group {
  text-align: left;
  padding-bottom: 10px;
}
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
.btn-group.number-input {
  text-align: right;
  padding: 10px 0;
}
.el-button {
  width: 34px;
  padding: 4px 4px;
  margin: 2.5px;
  height: 32px;
}
</style>
