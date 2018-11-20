<template>
  <div v-if="trackingConfigReady" class="expand configuration-mod">
    <label-item-container v-b-toggle.trackingSettings label="TRACKING CONFIGURATION" icon="glyphicon-cog" />
    <b-collapse id="trackingSettings" visible>
      <div class="card">
        <form id="trackingConfiguration" class="tracking-configuration" name="tracking-configuration">
          <group-container>
          <!-- Configuration Inputs -->
            <template v-for="(item, key) in trackingConfig">
              <settings-container v-if="item.input_type !== 'hidden'" :key="key" :label="item.label" custom-class="field-Tags">
                <template v-if="item.input_type === 'select'" slot="setting-bottom">
                  <el-select
                    v-validate="'required'"
                    class="float-left width-full"
                    :class="{'is-danger': errors.has(`trk-${item.name}`)}"
                    :name="`trk-${item.name}`"
                    :value="trackingData[`trk-${key}`]"
                    placeholder=""
                    :data-vv-as="item.label"
                    size="mini"
                    @input="onInputChange(`trk-${item.name}`, $event)">
                    <el-option
                      v-for="value in item.options"
                      :key="value"
                      :label="value"
                      :value="value" />
                  </el-select>
                  <span
                    v-show="errors.has(`trk-${item.name}`)"
                    class="help is-danger">{{ errors.first(`trk-${item.name}`) }}
                  </span>
                </template>
                <template v-else-if="item.input_type === 'hidden'" slot="setting-bottom">
                  <el-input
                    class="hidden"
                    :type="hidden"
                    :name="`trk-${item.name}`"
                    :value="trackingData[`trk-${key}`]" />
                </template>
                <template v-else slot="setting-bottom">
                  <el-input
                    v-validate="'required'"
                    :name="`trk-${item.name}`"
                    :value="trackingData[`trk-${key}`]"
                    :controls="false"
                    class="float-left"
                    :class="{'is-danger': errors.has(`trk-${item.name}`)}"
                    :data-vv-as="item.label"
                    size="mini"
                    @input="onInputChange(`trk-${item.name}`, $event)"
                    @blur="onBlur(`trk-${item.name}`, $event.target.value)" />
                  <span
                    v-show="errors.has(`trk-${item.name}`)"
                    class="help is-danger">{{ errors.first(`trk-${item.name}`) }}
                  </span>
                </template>
              </settings-container>
            </template>
          </group-container>
        </form>
      </div>
    </b-collapse>
  </div>
</template>

<script>
  import SettingsContainer from '../common/settings/containers/SettingsContainer.vue';
  import LabelItemContainer from '../common/containers/LabelItemContainer.vue';
  import GroupContainer from '../common/containers/GroupContainer.vue';
  import TrackingMixin from './mixins/trackingMixin';

  export default {
    components: {
      LabelItemContainer,
      SettingsContainer,
      GroupContainer
    },
    mixins: [ TrackingMixin ],
    props: {
      libraryKey: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        collapsed: false,
      }
    },
    computed: {
      trackingData() {
        if (this.campaignData.tracking !== undefined) {
          return this.campaignData.tracking;
        } else {
          let data = {};
          for (let k in this.trackingConfig) {
            data[`trk-${this.trackingConfig[k].name}`] = this.trackingConfig[k].values;
          }

          return data;
        }
      }
    },
    methods: {
      onInputChange(key, value) {
        this.$store.commit('campaign/saveCampaignData', {
          name: 'tracking',
          value: {...this.trackingData, [key]: value}
        });
      },
      onBlur(key, value) {
        this.onInputChange(key, value.replace(/[\<\>]/g, ''));
      }
    }
  };
</script>
<style lang="less" scoped>
.width-full {
  width: 100%;
}
.settings-container /deep/ label{
  font-weight: 600;
}
</style>
