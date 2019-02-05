<template>
  <div v-show="isCurrentElement">
    <settings-container
      key="destination-url"
      label="Destination Url"
      custom-class="keep-margin">
      <template slot="setting-bottom">
        <div v-if="validationRules">
          <stui-input-text
            v-model="href"
            v-validate.initial="validationRules"
            name="href"
            type="text"
            size="mini"
            placeholder="http://examp.le"
            :class="{'input': true, 'is-danger': hasError }" />
          <span v-show="hasError" class="help is-danger">{{ getErrorMessage }}</span>
        </div>
        <div v-else>
          <stui-input-text
            v-model="href"
            name="href"
            type="text"
            size="mini"
            placeholder="http://examp.le" />
        </div>
      </template>
    </settings-container>

    <settings-container
      v-if="plugin.config.target"
      key="target"
      label="Target"
      custom-class="keep-margin">
      <template slot="setting-right">
        <stui-field addons>
          <stui-button
            v-for="(icon, option) in plugin.config.options"
            :key="option"
            :data-tooltip="option"
            :title="option"
            size="mini"
            :active="target === option"
            highlight
            expanded
            @click="changeTarget(option)">
            <i :class="`glyphicon glyphicon-${icon}`" />
          </stui-button>
        </stui-field>
      </template>
    </settings-container>

    <settings-container
      v-if="plugin.config.title"
      key="title"
      label="Title"
      custom-class="keep-margin">
      <template slot="setting-right">
        <stui-input-text
          v-model="title"
          name="title"
          type="text"
          size="mini"
          placeholder="Title" />
      </template>
    </settings-container>
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
    target() {
      return this.element[this.plugin.subComponent].attribute ? this.element[this.plugin.subComponent].attribute.target : '_blank';
    },
    href: {
      get() {
        return this.element[this.plugin.subComponent].attribute.href;
      },
      set(value) {
        this.saveAttributeInThisElement({ property: 'href', value });
      },
    },
    title: {
      get() {
        return this.element[this.plugin.subComponent].attribute.title;
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
