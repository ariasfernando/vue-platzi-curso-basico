<template>
  <SettingsContainer :no-label="true">
    <template slot="setting-bottom">
      <SettingsContainer
        v-if="wrapperToggleable"
        :label="wrapper.label || 'Social Icons Row'"
        :label-expanded="true">
        <template slot="setting-right">
          <StuiToggleButton v-model="wrapperEnabled" />
        </template>
      </SettingsContainer>
      <SettingsContainer
        v-if="(wrapperToggleable && wrapperEnabled) || !wrapperToggleable"
        :label="items.label || 'Social Icons'">
        <template slot="setting-right">
          <StuiInputNumber
            v-model="visibleCounter"
            :max="items.max"
            :min="items.min"
            :step="items.step"
            :snap="items.snap" />
        </template>
      </SettingsContainer>
    </template>
  </SettingsContainer>
</template>

<script>
import pluginCampaignMixin from 'stensul/plugins/modules/mixins/pluginCampaignMixin';
import SettingsContainer from 'stensul/components/common/settings/containers/SettingsContainer.vue';

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 4;

export default {
  components: { SettingsContainer },
  mixins: [pluginCampaignMixin],
  data() {
    return {
      items: _.get(this.plugin.config, 'items', { min: DEFAULT_MIN, max: DEFAULT_MAX }),
      hideWrapperIfEmpty: _.get(this.plugin.config.wrapper, 'hideIfEmpty', true),
      wrapperToggleable: _.get(this.plugin.config.wrapper, 'toggleable'),
      wrapper: this.plugin.config.wrapper,
    };
  },
  computed: {
    wrapperElement() {
      return this.getElement(this.wrapper.id);
    },
    wrapperEnabled: {
      get() {
        return _.get(this.wrapperElement.container, 'styleOption.enableElement', true);
      },
      set(value) {
        this.saveElementProperty({
          elementId: this.wrapper.id,
          subComponent: 'container',
          link: 'styleOption',
          property: 'enableElement',
          value,
        });
        this.handleElementsVisibility(value ? this.visibleCounter : 0);
      },
    },
    visibleCounter: {
      get() {
        return this.plugin.data.visibleCounter;
      },
      set(value) {
        this.handleElementsVisibility(value);
        this.saveElementInThisPluginData({
          path: 'visibleCounter',
          value,
        });
      },
    },
  },
  methods: {
    toggleElement(elementId, value) {
      const element = this.getElement(elementId);
      if (element.container.styleOption.enableElement !== value) {
        this.saveElementProperty({
          elementId,
          subComponent: 'container',
          link: 'styleOption',
          property: 'enableElement',
          value,
        });
      }
      if (element.type === 'column-element') {
        this.toggleChildren(element, value);
      }
    },
    toggleChildren(element, value) {
      element.components.forEach((component) => {
        this.toggleElement(component.id, value, false);
      });
    },
    handleElementsVisibility(value) {
      const elements = this.wrapperElement.type === 'column-element' ? this.wrapperElement.components : this.wrapperElement.columns;
      const elementsToShow = elements.map(element => element.id);
      const elementsToHide = elementsToShow.splice(value, elementsToShow.length);
      elementsToShow.forEach((elementId) => {
        this.toggleElement(elementId, true);
      });
      elementsToHide.forEach((elementId) => {
        this.toggleElement(elementId, false);
      });
      // disable or enable wrapper according to its visible elements
      if (elementsToShow.length > 0) {
        this.toggleElement(this.wrapper.id, true);
      } else if (this.wrapper.toggleable || this.hideWrapperIfEmpty) {
        this.toggleElement(this.wrapper.id, false);
      }
    },
  },
};
</script>
