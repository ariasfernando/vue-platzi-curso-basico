<template>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
      <el-button
        v-for="option in options"
        :key="option"
        plain
        size="mini"
        :class="[`fa fa-align-${option}`,{ active: value === option }]"
        :data-tooltip="option"
        @click="changeAlignment(option)" />
    </template>
  </settings-container>
</template>

<script>
import pluginElementCampaignMixin from '../mixins/pluginElementCampaignMixin';
import pluginGenericCampaignMixin from '../mixins/pluginGenericCampaignMixin';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  components: { SettingsContainer },
  mixins: [pluginGenericCampaignMixin, pluginElementCampaignMixin],
  props: ['name', 'plugin'],
  data() {
    return {
      options: this.plugin.config.options,
    };
  },
  computed: {
    value: {
      get() {
        return this.element[this.plugin.subComponent].attribute.align;
      },
      set(value) {
        const { type, behaviour } = this.element;
        this.saveAttributeInThisElement({ property: 'align', value });
        if (type === 'button-element' && behaviour === 'text') {
          this.saveAttributeInThisElement({ subComponent: 'button', property: 'align', value });
        }
      },
    },
  },
  methods: {
    changeAlignment(option) {
      this.value = option;
    },
  },
};
</script>
<style lang='scss' scoped>
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

  &:before {
    color: #ffffff;
  }
}
.el-button + .el-button {
  margin-left: 0;
}
.el-button {
  width: 28px;
  padding: 4px 0;
  margin-right: 0px;
  height: 26px;
  border-radius: 0px;
  border-right: none;

  &:before {
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
.el-button:first-child:nth-last-child(4) ~ button {
  width: 25%;
}
.padding-zero {
  padding: 0;
}
</style>
