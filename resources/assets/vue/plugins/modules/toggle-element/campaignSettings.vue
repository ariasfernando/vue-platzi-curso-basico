<template>
  <settings-container
    v-if="module"
    :label="plugin.title"
    level="first"
    label-expanded="true">
    <template slot="setting-bottom">
      <div class="clearfix">
        <settings-container v-for="element in plugin.data.elements" :key="element.id" :label="element.label">
          <template slot="setting-half">
            <stui-toggle-button
              :value="getValue(element.id)"
              expanded
              @change="value => toggleChange(value, element.id)" />
          </template>
        </settings-container>
      </div>
    </template>
  </settings-container>
</template>

<script>
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import validatorMixin from '../mixins/validatorMixin';
import logicMixin from './logic.js';

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
        return this.getElement(elementId).enableElement;
      }
      return this.getElement(elementId).container.styleOption.enableElement;
    },
    toggleElement(value, elementId) {
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
        this.saveElementProperty(payload);
        this.resetErrors(value, this.moduleIndex);
      }

      this.runLogic(value, elementId);

      this.$emit('changed', {
        elementId,
        value,
      });
    },
    toggleChange(value, elementId) {
      if (this.plugin.data.preventEmpty && !value) {
        for (const i in this.plugin.data.elements) {
          if (this.plugin.data.elements[i].id !== elementId && this.getValue(this.plugin.data.elements[i].id)) {
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
    resetErrors(value, moduleIndex) {
      this.$store.commit('campaign/clearErrorsByModuleId', moduleIndex);
      if (this.isCustom) {
        this.registerCustomModuleDefaultValidationErrors(moduleIndex);
      }
    },
  },
};
</script>
