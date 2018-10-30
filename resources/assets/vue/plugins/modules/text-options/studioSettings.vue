<template>
  <div>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
        <toggle-button v-model="pluginEnabled" />
      </template>
    </settings-container>
    <template v-if="pluginEnabled">
      <div class="btn-group">
        <el-button
          v-for="(option, optionName) in plugin.config.options"
          :key="optionName"
          v-b-tooltip.hover
          :class="[option.icon , {'active': option.value}]"
          :title="option.label"
          :data-tooltip="option.label"
          size="mini"
          @click.prevent="toggleOption(optionName, option.value)" />
      </div>
      <group-container label="Advance Settings">
        <!-- forecolor -->
        <template v-if="plugin.config.options.forecolor.value">
          <settings-container v-if="!plugin.config.options.forecolor.textcolor_from_library && $can('tiny-plugin-forecolor-palette')" label="Color List">
            <template slot="setting-right">
              <el-input
                v-model="textColorMap"
                v-validate="'required'"
                size="mini"
                placeholder='[{ label: "Black", value: "#000000" },{ label: "Gray", value: "#474646" },{ label: "Blue", value: "#79A8C9" },{ label: "Red", value: "#CD202C" }]' />
            </template>
          </settings-container>
        </template>
        <template v-if="plugin.config.options.forecolor.value && $can('tiny-plugin-forecolor-palette-library')">
          <settings-container label="Color List By Library">
            <template slot="setting-right">
              <toggle-button
                :value="plugin.config.options.forecolor.textcolor_from_library"
                @change="newValue => changeOption(newValue, 'forecolor', 'textcolor_from_library')" />
            </template>
          </settings-container>
          <settings-container v-if="plugin.config.options.forecolor.textcolor_from_library" label="Palette Name">
            <template slot="setting-right">
              <el-input
                v-model="palette_name"
                v-validate="'required'"
                size="mini"
                placeholder="name" />
            </template>
          </settings-container>
        </template>
        <!-- backcolor -->
        <template v-if="plugin.config.options.backcolor.value">
          <settings-container v-if="!plugin.config.options.backcolor.textcolor_from_library && $can('tiny-plugin-forecolor-palette')" label="Highlight Color List">
            <template slot="setting-right">
              <el-input
                v-model="backColorMap"
                v-validate="'required'"
                size="mini"
                placeholder='[{ label: "Yellow", value: "#E3EB05" },{ label: "Orange", value: "#FC9264" },{ label: "Pink", value: "#FC6487" },{ label: "Blue", value: "#64EAFC" }]' />
            </template>
          </settings-container>
        </template>
        <template v-if="plugin.config.options.backcolor.value && $can('tiny-plugin-forecolor-palette-library')">
          <settings-container label="Highlight Color List By Library">
            <template slot="setting-right">
              <toggle-button
                :value="plugin.config.options.backcolor.backcolor_from_library"
                @change="newValue => changeOption(newValue, 'backcolor', 'backcolor_from_library')" />
            </template>
          </settings-container>
          <settings-container v-if="plugin.config.options.backcolor.backcolor_from_library" label="Palette Name">
            <template slot="setting-right">
              <el-input
                v-model="back_palette_name"
                v-validate="'required'"
                size="mini"
                placeholder="name" />
            </template>
          </settings-container>
        </template>
        <!--settings-->
        <template>
          <div v-for="(tinySetting, key) in plugin.config.settings" :key="key" class="clearfix">
            <!-- Input if config needs it -->
            <settings-container v-if="showSetting(tinySetting.dependsOn) && $can('tiny-plugin-' + key)" :label="tinySetting.title">
              <template slot="setting-right">
                <el-input-number
                  v-if="tinySetting.type === 'number'"
                  v-b-tooltip.hover
                  :value="tinySetting.content || 0"
                  size="mini"
                  :title="key"
                  :min="0"
                  :name="key"
                  @change="(value)=>changeSetting(value, key)" />
                <el-select
                  v-else-if="tinySetting.type === 'select'"
                  size="mini"
                  :value="tinySetting.content"
                  @change="(value) => changeSetting(value, key)">
                  <el-option
                    v-for="(opt, optKey) in tinySetting.options"
                    :key="optKey"
                    :value="optKey"
                    :label="opt" />
                </el-select>
                <el-input
                  v-else-if="tinySetting.type === 'text'"
                  v-b-tooltip.hover
                  size="mini"
                  :title="key"
                  :name="key"
                  :value="tinySettingContent(tinySetting.content)"
                  @change="(value)=>changeSetting(value, key)" />
                <component
                  :is="tinySetting.type"
                  v-else
                  :value="tinySetting.content"
                  :default-value="tinySetting.defaultValue"
                  :false-text="tinySetting.falseText"
                  @change="(value)=>changeSetting(value, key)" />
              </template>
            </settings-container>
          </div>
        </template>
      </group-container>
    </template>
  </div>
</template>

<script>
import GroupContainer from '../../../components/common/containers/GroupContainer.vue';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  components: {
    GroupContainer,
    SettingsContainer,
  },
  props: ['name', 'element', 'plugin'],
  computed: {
    currentComponent() {
      return this.$store.getters['module/currentComponent'];
    },
    module() {
      return this.$store.getters['module/module'];
    },
    pluginEnabled: {
      get() {
        return this.plugin.enabled;
      },
      set(value) {
        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          enabled: value,
        };
        this.$store.commit('module/togglePlugin', payload);
      },
    },
    textColorMap: {
      get() {
        const value = this.plugin.config.options.forecolor.textcolor_map;
        return typeof value === 'object' ? JSON.stringify(value) : value;
      },
      set(value) {
        if (Application.utils.isJsonString(value)) {
          this.changeOption(JSON.parse(value), 'forecolor', 'textcolor_map');
        } else if (_.isEmpty(value)) {
          this.changeOption(value, 'forecolor', 'textcolor_map');
        }
      },
    },
    backColorMap: {
      get() {
        const value = this.plugin.config.options.backcolor.backcolor_map;
        return typeof value === 'object' ? JSON.stringify(value) : value;
      },
      set(value) {
        if (Application.utils.isJsonString(value)) {
          this.changeOption(JSON.parse(value), 'backcolor', 'backcolor_map');
        } else if (_.isEmpty(value)) {
          this.changeOption(value, 'backcolor', 'backcolor_map');
        }
      },
    },
    palette_name: {
      get() {
        return this.plugin.config.options.backcolor.palette_name;
      },
      set(value) {
        this.changeOption(value, 'backcolor', 'palette_name');
      },
    },
    back_palette_name: {
      get() {
        return this.plugin.config.options.backcolor.palette_name;
      },
      set(value) {
        this.changeOption(value, 'backcolor', 'palette_name');
      },
    },
  },
  methods: {
    showSetting(dependsOn) {
      if (dependsOn) {
        return this.plugin.config[dependsOn.config][dependsOn.name].value;
      }
      return true;
    },

    toggleOption(optionName, oldValue) {
      const value = !oldValue;
      const payload = {
        plugin: this.name,
        componentId: this.element.id,
        path: `options.${optionName}.value`,
        value,
      };
      this.$store.commit('module/setPluginElementConfig', payload);
    },
    changeOption(value, subOption, settingName) {
      const payload = {
        plugin: this.name,
        componentId: this.element.id,
        path: `options.${subOption}.${settingName}`,
        value,
      };
      this.$store.commit('module/setPluginElementConfig', payload);
    },
    changeSetting(value, settingName) {
      const payload = {
        plugin: this.name,
        componentId: this.element.id,
        path: `settings.${settingName}.content`,
        value: Application.utils.isJsonString(value)
          ? JSON.parse(value)
          : value,
      };
      this.$store.commit('module/setPluginElementConfig', payload);
    },
    tinySettingContent(content) {
      if (content) {
        return typeof content === 'object' ? JSON.stringify(content) : content;
      }
      return 0;
    },
  },
};
</script>
<style lang='scss' scoped>
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
