<template>
  <SettingsContainer
    v-if="module"
    :label="plugin.title"
    level="first"
    label-expanded="true">
    <template slot="setting-bottom">
      <div class="clearfix">
        <SettingsContainer v-for="element in plugin.data.elements" :key="element.id" :label="element.label">
          <template slot="setting-half">
            <StuiToggleButton
              :value="getValue(element.id)"
              expanded
              @change="value => toggleChange(value, element.id, element.preventDefault)" />
          </template>
        </SettingsContainer>
      </div>
    </template>
  </SettingsContainer>
</template>

<script>
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import validatorMixin from '../mixins/validatorMixin';
import logicMixin from './logic';

export default {
  components: { SettingsContainer },
  mixins: [validatorMixin, logicMixin, pluginCampaignMixin],
  data() {
    return {
      subComponent: 'container',
    };
  },
  methods: {
    getValue(elementId) {
      if (this.isCustom) {
        return this.getElement(elementId).enableElement;
      }
      const element = this.getElement(elementId);
      return element.container.styleOption.forceVisible || element.container.styleOption.enableElement;
    },
    toggleElement(value, elementId, preventDefault) {
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
          elementId,
          link: 'styleOption',
          property: 'enableElement',
          value,
        };
        if (!preventDefault) {
          this.saveElementProperty(payload);
        }
        this.resetErrors(value, this.moduleId);
      }

      this.runLogic(value, elementId);

      this.$emit('changed', {
        elementId,
        value,
      });
    },
    toggleChange(value, elementId) {
      if (this.plugin.data.preventEmpty && !value) {
        _.forEach(this.plugin.data.elements, (element) => {
          if (element.id !== elementId && this.getValue(element.id)) {
            this.toggleElement(value, elementId);
            return false;
          }
          return true;
        });

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
