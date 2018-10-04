<template>
  <div v-show="(elementKey === currentElementKey)">
    <settings-container key="destination-url" label="Destination Url" custom-class="destination-url">
      <template slot="setting-bottom">
        <p v-if="validationRules">
          <el-input
            v-model="href"
            v-validate.initial="validationRules"
            name="href"
            type="text"
            size="mini"
            placeholder="http://examp.le"
            :class="{'input': true, 'is-danger': hasError }" />
          <span v-show="hasError" class="help is-danger">{{ getErrorMessage }}</span>
        </p>
        <p v-else>
          <el-input
            v-model="href"
            name="href"
            type="text"
            size="mini"
            placeholder="http://examp.le" />
        </p>
      </template>
    </settings-container>

    <settings-container v-if="plugin.config.target" key="target" label="Target">
      <template slot="setting-right">
        <el-button
          v-for="(icon, option) in plugin.config.options"
          :key="option"
          :data-tooltip="option"
          plain
          size="mini"
          :class="[`glyphicon glyphicon-${icon}`,{ 'active': target === option }]"
          @click="changeTarget(option)" />
      </template>
    </settings-container>
  </div>
</template>

<script>
  import _ from 'lodash';
  import validatorMixin from '../mixins/validatorMixin';
  import pluginGenericCampaignMixin from '../mixins/pluginGenericCampaignMixin';
  import pluginElementCampaignMixin from '../mixins/pluginElementCampaignMixin';
  import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

  export default {
    components: { SettingsContainer },
    mixins: [validatorMixin, pluginGenericCampaignMixin, pluginElementCampaignMixin],
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
      validationRules() {
        const rules = [];
        _.each(this.plugin.config.validations, (e, i) => {
          if (e) {
            rules.push(i);
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

<style lang="scss" scoped>
.el-button:focus,
.el-button:hover {
  color: inherit;
  border-color: #78dcd6;
  background-color: inherit;
}
.el-button.active {
  color: #ffffff;
  border-color: rgb(120, 220, 214);
  background-color: rgb(120, 220, 214);

  &:before{
    color: #ffffff;
  }
}
.el-button + .el-button {
  margin-left: 0;
}
.el-button {
  width: 33%;
  padding: 4px 0;
  margin-right: 0px;
  height: 26px;
  border-radius: 0px;
  border-right: none;

  &:before{
    color: #999999;
  }

  &:first-of-type {
    margin: 0;
    border-radius: 2px 0px 0px 2px;
    border-right: none;
  }

  &:last-of-type {
    margin: 0;
    border-radius: 0px 2px 2px 0px;
    border-right: 1px solid #dddddd;
  }
}
.el-button:first-child:nth-last-child(2),
.el-button:first-child:nth-last-child(2) ~ button {
    width: 50%;
}
.el-button:first-child:nth-last-child(3),
.el-button:first-child:nth-last-child(3) ~ button {
    width: 33%;
}
.el-button:first-child:nth-last-child(4),
.el-button:first-child:nth-last-child(4) ~ button{
    width: 25%;
}
.padding-zero {
  padding: 0;
}
.el-input >>> .el-input__inner{
  border-radius: 2px;
  font-weight: 300;
  padding-left: 8px;
  height: 26px;

  &:focus{
    border: 1px solid #78dcd6;
  }
}
</style>