<template>
  <div>
    <SettingsContainer :label="plugin.title" :arrow="arrowState" @toggleArrow="setSlideToggles">
      <template slot="setting-right">
        <StuiToggleButton :value="plugin.enabled" @change="toggle" />
      </template>
    </SettingsContainer>
    <b-collapse :id="pluginKey" :visible="arrowState">
      <SettingsContainer v-if="plugin.enabled && $can('std-image-element_editor_plugin-mobile-upload')" label="Mobile Image Upload">
        <template slot="setting-right">
          <StuiToggleButton :value="hasImageMobile" @change="toggleImageMobile" />
        </template>
      </SettingsContainer>
      <template v-for="(option, name) in plugin.config" v-if="plugin.enabled">
        <SettingsContainer v-if="$can('std-image-element_editor_'+name)" :label="option.label" :key="name">
          <template slot="setting-right">
            <StuiToggleButton v-if="option.type === 'switch'" :disabled="!plugin.enabled" :value="option.value" @change="(value)=>updateField(value, `${name}.value`)" />
            <StuiInputNumber
              v-if="option.type === 'number'"
              v-validate="'required'"
              :value="option.value"
              :min="option.min || 0"
              :max="option.max || Infinity"
              :step="parseFloat(option.step)"
              @change="(value)=>updateField(value, `${name}.value`)" />
            <StuiInputText v-if="option.type === 'text'" :disabled="!plugin.enabled" :value="option.value" @change="(value)=>updateField(value, `${name}.value`)" />
            <el-select
              v-if="option.type === 'select' || option.type === 'multi-select'"
              size="mini"
              :value="option.value"
              @change="(value) => updateField(value, `${name}.value`)">
              <el-option
                v-for="(opt, key) in option.options"
                :key="key"
                :value="opt._id ? opt._id : opt"
                :label="opt.name ? opt.name : opt" />
            </el-select>
            <label v-if="option.type === 'label'" :value="option.label" />
          </template>
        </SettingsContainer>
        <template v-if="option.value && option.config" v-for="(subopt, subname) in option.config">
          <SettingsContainer v-if="$can('std-image-element_editor_'+subname)" :label="subopt.label" :key="subname">
            <template slot="setting-right">
              <StuiToggleButton v-if="subopt.type === 'switch'" :value="subopt.value" active-color="#78DCD6" @change="(value)=>updateField(value, `${name}.config.${subname}.value`)" />
              <StuiInputText v-if="subopt.type === 'text'" :value="subopt.value" @change="(value)=>updateField(value, `${name}.config.${subname}.value`)" />
              <StuiInputNumber
                v-if="subopt.type === 'number'"
                v-validate="'required'"
                :value="subopt.value"
                :min="subopt.min || 0"
                :max="subopt.max || Infinity"
                :step="parseFloat(subopt.step)"
                @change="(value)=>updateField(value, `${name}.config.${subname}.value`)" />
              <el-select
                v-if="subopt.type === 'select' || subopt.type === 'multi-select'"
                :value="subopt.value"
                :multiple="subopt.type === 'multi-select'"
                :list="subopt.options"
                @change="(value) => updateField(value, `${name}.config.${subname}.value`)" />
            </template>
          </SettingsContainer>
          <template v-if="subopt.value && subopt.config" v-for="(interop, intername) in subopt.config">
            <SettingsContainer v-if="$can('std-image-element_editor_'+intername)" :key="intername" :label="interop.label">
              <template slot="setting-right">
                <StuiToggleButton v-if="interop.type === 'switch'" :value="interop.value" active-color="#78DCD6" @change="(value)=>updateField(value, `${name}.config.${subname}.config.${intername}.value`)" />
                <StuiInputText  v-if="interop.type === 'text'" :value="interop.value" @change="(value)=>updateField(value, `${name}.config.${subname}.config.${intername}.value`)" />
                <StuiInputNumber
                  v-if="interop.type === 'number'"
                  v-validate="'required'"
                  :value="interop.value"
                  :min="interop.min || 0"
                  :max="interop.max || Infinity"
                  :step="parseFloat(interop.step)"
                  @change="(value)=>updateField(value, `${name}.config.${subname}.config.${intername}.value`)"/>
                <el-select
                  v-if="interop.type === 'select' || interop.type === 'multi-select'"
                  size="mini"
                  :value="interop.value"
                  :multiple="interop.type === 'multi-select'"
                  @change="(value) => updateField(value, `${name}.config.${subname}.config.${intername}.value`)">
                  <el-option
                    v-for="(opt, key) in interop.options"
                    :key="key"
                    :value="key"
                    :label="opt.name ? opt.name : opt" />
                </el-select>
              </template>
            </SettingsContainer>
          </template>
        </template>
      </template>
    </b-collapse>
  </div>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginMixinAdmin from '../mixins/pluginMixinAdmin';

export default {
  components: { SettingsContainer },
  mixins: [pluginMixinAdmin],
  computed: {
    hasImageMobile() {
      return this.element.image.styleOption.hasImageMobile;
    },
  },
  mounted() {
    this.$store.dispatch('module/getLibraries', {
      plugin: this.name,
      elementId: this.elementId,
    });
  },
  methods: {
    updateField(value, path) {
      this.updatePluginConfig({ value, path });
    },
    toggleImageMobile(value) {
      const payload = {
        elementId: this.elementId,
        subComponent: 'image',
        link: 'styleOption',
        property: 'hasImageMobile',
        value,
      };
      this.$store.commit('module/saveElementProperty', payload);
    },
  },
};
</script>
