<template>
  <settings-container v-if="module" :label="plugin.title" level="first">
    <template slot="setting-bottom">
      <settings-container v-for="element in plugin.data.elements" :key="element.id" :label="element.label">
        <template slot="setting-half">
          <toggle-button
            :value="getValue(element.id)"
            @change="value => toggleChange(value, element.id)" />
        </template>
      </settings-container>
    </template>
  </settings-container>
</template>

<script>
  import pluginGenericCampaignMixin from '../mixins/pluginGenericCampaignMixin';
  import pluginModuleCampaignMixin from '../mixins/pluginModuleCampaignMixin';
  import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
  import validatorMixin from '../mixins/validatorMixin';

  export default {
    components: { SettingsContainer },
    mixins: [validatorMixin, pluginGenericCampaignMixin, pluginModuleCampaignMixin],
    data() {
      return {
        subComponent: 'container',
      };
    },
    methods: {
      getValue(elementId){
        return this.getElement(elementId).container.styleOption.enableElement;
      },
      toggleElement(value, elementId) {
        if (this.isCustom) {
          this.$store.dispatch('campaign/updateCustomElementProperty', {
            moduleId: this.currentCustomModule,
            subComponent: elementId,
            property: 'enableElement',
            value,
          });
          this.resetErrors(value, this.currentCustomModule);
        } else {
          const payload = {
            componentId: elementId,
            link: 'styleOption',
            property: 'enableElement',
            value,
          };
          this.saveElementProperty(payload);
          this.resetErrors(value, this.moduleId);
        }
        this.$emit('changed', {
          elementId,
          value,
        });
      },
      toggleChange(value, elementId) {
        if (this.plugin.data.preventEmpty && !value){
          for (const i in this.plugin.data.elements) {
            if (this.plugin.data.elements[i].id !== elementId && this.getValue(this.plugin.data.elements[i].id)){
              this.toggleElement(value, elementId);
              return;
            }
          }
          this.$root.$toast("You've to leave at least one element", {
            className: 'et-error',
            horizontalPosition: 'right',
          });
        } else {
          this.toggleElement(value, elementId);
        }
      },
      resetErrors(value, moduleId) {
        this.$store.commit('campaign/clearErrorsByModuleId', moduleId);
        if (this.isCustom) {
          this.registerCustomModuleDefaultValidationErrors(moduleId);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
.settings-container .el-switch{
  float: left;
}
</style>
