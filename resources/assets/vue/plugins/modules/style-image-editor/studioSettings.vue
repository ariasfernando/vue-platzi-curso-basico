<template>
  <div>
    <SettingsContainer :label="plugin.title" :arrow="arrowState" @toggleArrow="setSlideToggles">
      <template slot="setting-right">
        <StuiToggleButton :value="plugin.enabled" @change="toggle" />
      </template>
    </SettingsContainer>
    <b-collapse :id="pluginKey" :visible="arrowState">
      <settings-container v-if="plugin.enabled && $can('std-image-element_editor_plugin-mobile-upload')" label="Mobile Image Upload">
        <template slot="setting-right">
          <StuiToggleButton :value="hasImageMobile" @change="toggleImageMobile" />
        </template>
      </settings-container>
      <template v-for="(option, name) in plugin.config" v-if="plugin.enabled">
        <settings-container v-if="$can('std-image-element_editor_'+name)" :label="option.label" :key="name">
          <template slot="setting-right">
            <StuiToggleButton v-if="option.type === 'switch'" :disabled="!plugin.enabled" :value="option.value" @change="(value)=>updateField(value, `${name}.value`)" />
            <StuiInputNumber
              v-if="option.type === 'number'"
              v-validate="'required'"
              :value="option.value"
              @change="(value)=>updateField(value, `${name}.value`)"
              :min="option.min || 0"
              :max="option.max || Infinity"
              :step="parseFloat(option.step)" />
            <StuiInputText v-if="option.type === 'text'" :disabled="!plugin.enabled" :value="option.value" @change="(value)=>updateField(value, `${name}.value`)" />
            <el-select
              size="mini"
              v-if="option.type === 'select' || option.type === 'multi-select'"
              @change="(value) => updateField(value, `${name}.value`)"
              :value="option.value"
              :multiple="option.type === 'multi-select'">
              <el-option
                v-for="(opt, key) in option.options"
                :value="opt._id ? opt._id : opt"
                :key="key"
                :label="opt.name ? opt.name : opt"></el-option>
            </el-select>
            <label v-if="option.type === 'label'" :value="option.label"></label>
          </template>
        </settings-container>
        <template v-if="option.value && option.config" v-for="(subopt, subname) in option.config">
          <settings-container v-if="$can('std-image-element_editor_'+subname)" :label="subopt.label" :key="subname">
            <template slot="setting-right">
              <StuiToggleButton v-if="subopt.type === 'switch'" :value="subopt.value" active-color="#78DCD6" @change="(value)=>updateField(value, `${name}.config.${subname}.value`)" />
              <StuiInputText v-if="subopt.type === 'text'" :value="subopt.value" @change="(value)=>updateField(value, `${name}.config.${subname}.value`)" />
              <StuiInputNumber
                v-if="subopt.type === 'number'"
                v-validate="'required'"
                :value="subopt.value"
                @change="(value)=>updateField(value, `${name}.config.${subname}.value`)"
                :min="subopt.min || 0"
                :max="subopt.max || Infinity"
                :step="parseFloat(subopt.step)" />
              <el-select
                v-if="subopt.type === 'select' || subopt.type === 'multi-select'"
                @change="(value) => updateField(value, `${name}.config.${subname}.value`)"
                :value="subopt.value"
                :multiple="subopt.type === 'multi-select'"
                :list="subopt.options" />
              </template>
          </settings-container>
          <template v-if="subopt.value && subopt.config" v-for="(interop, intername) in subopt.config">
            <settings-container v-if="$can('std-image-element_editor_'+intername)" :label="interop.label" :key="intername">
              <template slot="setting-right">
                <StuiToggleButton v-if="interop.type === 'switch'" :value="interop.value" active-color="#78DCD6" @change="(value)=>updateInterField(value, `${name}.config.${subname}.config.${intername}.value`)" />
                <StuiInputText  v-if="interop.type === 'text'" :value="interop.value" @change="(value)=>updateInterField(value, `${name}.config.${subname}.config.${intername}.value`)" />
                <StuiInputNumber
                  v-if="interop.type === 'number'"
                  v-validate="'required'"
                  :value="interop.value"
                  @change="(value)=>updateInterField(value, `${name}.config.${subname}.config.${intername}.value`)"
                  :min="interop.min || 0"
                  :max="interop.max || Infinity"
                  :step="parseFloat(interop.step)" />
                <el-select
                  size="mini"
                  v-if="interop.type === 'select' || interop.type === 'multi-select'"
                  @change="(value) => updateInterField(value, `${name}.config.${subname}.config.${intername}.value`)"
                  :value="interop.value"
                  :multiple="interop.type === 'multi-select'">
                  <el-option
                    v-for="(opt, key) in interop.options"
                    :value="key"
                    :key="key"
                    :label="opt.name ? opt.name : opt"></el-option>
                </el-select>
              </template>
            </settings-container>
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
    methods: {
        updateField(value, path) {
            this.updatePluginConfig({value, path});
        },
        toggleImageMobile(value) {
            const payload = {
                elementId: this.elementId,
                subComponent: 'image',
                link: 'styleOption',
                property: 'hasImageMobile',
                value,
            };
            this.$store.commit("module/saveElementProperty", payload);
        },
    },
    mounted() {
        this.$store.dispatch('module/getLibraries', {
            plugin: this.name,
            elementId: this.elementId,
        });
    }
};
</script>
