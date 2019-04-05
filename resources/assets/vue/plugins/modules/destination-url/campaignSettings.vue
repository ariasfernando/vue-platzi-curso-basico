<template>
  <div v-show="isCurrentElement" class="settings-wrapper">
    <SettingsContainer
      key="destination-url"
      label="Destination Url">
      <template slot="setting-bottom">
        <StuiInputText
          v-if="validationRules"
          v-model="href"
          v-validate.initial="validationRules"
          name="href"
          placeholder="http://examp.le"
          :validation-notif="{
            msg: getErrorMessage,
            type: 'error',
            show: hasError,
          }"
          :debounce="500" />
        <StuiInputText
          v-else
          v-model="href"
          name="href"
          placeholder="http://examp.le"
          :debounce="500" />
      </template>
    </SettingsContainer>

    <SettingsContainer
      v-if="plugin.config.target"
      key="target"
      label="Target">
      <template slot="setting-right">
        <StuiField addons>
          <StuiButton
            v-for="(icon, option) in plugin.config.options"
            :key="option"
            :data-tooltip="option"
            :title="option"
            :active="target === option"
            highlight
            expanded
            @click="changeTarget(option)">
            <i :class="`glyphicon glyphicon-${icon}`" />
          </StuiButton>
        </StuiField>
      </template>
    </SettingsContainer>

    <SettingsContainer
      v-if="plugin.config.title"
      key="title"
      label="Title">
      <template slot="setting-right">
        <StuiInputText
          v-model="title"
          name="title"
          placeholder="Title"
          :debounce="500" />
      </template>
    </SettingsContainer>
  </div>
</template>

<script>
import validatorMixin from '../mixins/validatorMixin';
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  components: { SettingsContainer },
  mixins: [validatorMixin, pluginCampaignMixin],
  computed: {
    subElement() {
      return this.element[this.plugin.subComponent] || this.element.structure;
    },
    target() {
      return this.subElement.attribute.target || '_blank';
    },
    href: {
      get() {
        return this.subElement.attribute.href;
      },
      set(value) {
        this.saveAttributeInThisElement({ property: 'href', value });
      },
    },
    title: {
      get() {
        return this.subElement.attribute.title;
      },
      set(value) {
        this.saveAttributeInThisElement({ property: 'title', value });
      },
    },
    validationRules() {
      const rules = [];
      _.each(this.plugin.config.validations, (e, i) => {
        if (e === true) {
          rules.push(i);
        } else if (typeof e === 'object' && e.selected !== 'disabled') {
          rules.push(e.selected);
        }
      });
      return rules.join('|');
    },
  },
  watch: {
    href() {
      this.$nextTick(() => {
        if (this.validationRules) {
          this.validate();
        }
      });
    },
  },
  methods: {
    changeTarget(value) {
      this.saveAttributeInThisElement({
        property: 'target',
        value,
      });
    },
  },
};
</script>
