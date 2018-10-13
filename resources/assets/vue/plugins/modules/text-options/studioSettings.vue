<template>
  <div>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
        <toggle-button :value="plugin.enabled" @change="toggle" />
      </template>
    </settings-container>

    <div v-if="plugin.enabled" class="btn-group">
      <el-button
        v-for="(option, name) in plugin.config.options"
        :key="name"
        v-b-tooltip.hover
        :class="[option.icon , {'active': option.value}]"
        :title="option.label"
        :data-tooltip="option.label"
        size="mini"
        @click.prevent="toggleOption(name,option.value)" />
    </div>
    <div v-if="plugin.config.options.forecolor.value" class="clearfix">
      <settings-container v-if="!plugin.config.options.forecolor.textcolor_from_library" label="Color List">
        <template slot="setting-right">
          <el-input
            v-model="textColorMap"
            v-validate="'required'"
            size="mini"
            :placeholder='[{ label: "Black", value: "#000000" },{ label: "Gray", value: "#474646" }]'
            class="clearfix" />
        </template>
      </settings-container>
    </div>
    <div v-if="plugin.config.options.forecolor.value" class="clearfix">
      <settings-container label="textcolor_from_library">
        <template slot="setting-right">
          <toggle-button
            :value="plugin.config.options.forecolor.textcolor_from_library"
            @change="newValue => changeOption(newValue,'textcolor_from_library','forecolor')" />
        </template>
      </settings-container>
      <settings-container v-if="plugin.config.options.forecolor.textcolor_from_library" label="palette_name">
        <template slot="setting-right">
          <el-input
            v-model="palette_name"
            v-validate="'required'"
            size="mini"
            placeholder="name"
            class="clearfix" />
        </template>
      </settings-container>
    </div>
    <div v-for="(tinySetting, key) in plugin.config.settings" :key="key" v-if="plugin.enabled" class="clearfix">
      <settings-container v-if="showSetting(tinySetting.dependsOn)" :label="tinySetting.title">
        <template slot="setting-right">
          <toggle-button
            :value="tinySetting.value"
            @change="(newValue)=>toggleSetting(newValue, key)" />
        </template>
      </settings-container>

      <!-- Input if config needs it -->
      <div v-if="isAValidSetting(tinySetting ,key)">
        <el-input-number
          v-if="tinySetting.type === 'number'"
          v-b-tooltip.hover
          :title="key"
          :name="key"
          :value="tinySetting.content || 0"
          :min="0"
          size="mini"
          @change="(value)=>changeSetting(value, key)" />
        <el-input
          v-if="tinySetting.type === 'text'"
          v-b-tooltip.hover
          size="mini"
          :title="key"
          :name="key"
          :value="tinySetting.content || 0"
          @change="(value)=>changeSetting(value, key)" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  props: ['name'],
  components: { SettingsContainer },
  data() {
    return {
      enabled: false,
      options: {},
    };
  },
  computed: {
    currentComponent() {
      return this.$store.getters['module/currentComponent'];
    },
    module() {
      return this.$store.getters['module/module'];
    },
    plugin() {
      const module = this.module;
      const columnId = this.currentComponent.columnId;
      const componentId = this.currentComponent.componentId;

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
        const value = this.plugin.config.options.forecolor.textcolor_map;
        return typeof value === 'object' ? JSON.stringify(value) : value;
      },
      set(value) {
        if (Application.utils.isJsonString(value)) {
          this.changeOption(JSON.parse(value), 'textcolor_map', 'forecolor');
        } else if (_.isEmpty(value)) {
          this.changeOption(value, 'textcolor_map', 'forecolor');
        }
      },
    },
    palette_name: {
      get() {
        return this.plugin.config.options.forecolor.palette_name;
      },
      set(value) {
        this.changeOption(value, 'palette_name', 'forecolor');
      },
    },
  },
  methods: {
    showSetting(dependsOn) {
      if (dependsOn) {
        return this[dependsOn.config][dependsOn.name].value;
      } else {
        return true;
      }
    },
    toggle(value) {
      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        enabled: value,
      };
      // Update state of the component
      this.$store.commit('module/togglePlugin', payload);

      // Set current component
      this.$store.commit('module/setCurrentComponent', {
        columnId: payload.columnId,
        componentId: payload.componentId,
      });
      // Update component view in the third column
      this.$store.commit('module/setChangeSettingComponent', {
        style:
          this.module.structure.columns[payload.columnId].components[
            payload.componentId
          ].style || {},
        attribute:
          this.module.structure.columns[payload.columnId].components[
            payload.componentId
          ].attribute || {},
      });
    },

    toggleOption(name, oldValue) {
      const value = !oldValue;
      const options = {};
      options[name] = {
        value,
      };

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config: {
          options,
        },
      };

      // Save plugin data
      this.$store.commit('module/savePlugin', payload);
    },

    toggleSetting(value, setting) {
      const options = {};
      let content;

      // if toogle is disabled the inputs value will be 0
      if (value === false) {
        content = 0;
      }
      options[setting] = {
        value,
        content,
      };

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config: {
          settings: options,
        },
      };

      // Save plugin data
      this.$store.commit('module/savePlugin', payload);
    },

    changeSetting(value, settingName) {
      const setting = {};
      // switch to other var because value saved toggle state.
      const content = value;

      setting[settingName] = {
        content,
      };

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config: {
          settings: setting,
        },
      };

      this.$store.commit('module/savePlugin', payload);
    },

    changeOption(value, setting, subOption) {
      const option = {};
      option[subOption] = {};
      option[subOption][setting] = value;

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config: {
          options: option,
        },
        subOption,
      };

      // Save plugin data
      this.$store.commit('module/savePluginSuboption', payload);
    },
    isAValidSetting(tinySetting, key) {
      return (
        [
          'truncate',
          'lines_limit',
          'fontsize_formats',
          'style_formats',
          'link_fixed_color',
          'st_formats_menu',
          'formats',
        ].indexOf(key) !== -1 && tinySetting.value === true
      );
    },
  },
};
</script>
<style lang="scss" scoped>
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
