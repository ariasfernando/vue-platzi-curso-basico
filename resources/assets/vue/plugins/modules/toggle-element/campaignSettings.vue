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
            <stui-toggle-button
              :value="getValue(element.id)"
              expanded
              @change="value => toggleChange(value, element.id)" />
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

  computed: {
    modules() {
      return this.$store.getters['campaign/modules'];
    },
    moduleIndex() {
      let moduleIndex = false;
      _.forEach(this.modules, (currentModule, currentModuleIndex) => {
        if (currentModule.idInstance === this.moduleIdInstance) {
          moduleIndex = currentModuleIndex;
          return false;
        }
        return true;
      });
      return moduleIndex;
    },
  },
  methods: {
    getValue(elementId) {
      if (this.isCustom) {
        return _.get(this.getElement(elementId), 'enableElement', true);
      }
      return _.get(this.getElement(elementId), 'container.styleOption.enableElement', true);
    },
    toggleElement(value, elementId, preventDefault) {
      if (this.isCustom) {
        this.$store.dispatch('campaign/updateCustomElementProperty', {
          moduleId: this.moduleIndex,
          subComponent: elementId,
          property: 'enableElement',
          value,
        });
        this.resetErrors(value, this.moduleIndex);
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
    toggleChange(value, elementId, preventDefault) {
      if (this.plugin.data.preventEmpty && !value) {
        const otherElementIsEnabled = this.plugin.data.elements.some(element =>
          element.id !== elementId && this.getValue(element.id));

        if (otherElementIsEnabled) {
          this.toggleElement(value, elementId, preventDefault);
        } else {
          this.$root.$toast("You've to leave at least one element", {
            className: 'et-error',
            horizontalPosition: 'right',
          });
        }
      } else {
        this.toggleElement(value, elementId, preventDefault);
      }
    },
    resetErrors(value, moduleIndex) {
      if (this.isCustom) {
        this.registerCustomModuleDefaultValidationErrors(moduleIndex);
      }
    },
  },
};
</script>
