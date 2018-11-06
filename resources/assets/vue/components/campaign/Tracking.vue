<template>
  <div v-if="trackingConfigReady" class="expand configuration-mod">
    <label-item-container v-b-toggle.trackingSettings label="TRACKING CONFIGURATION" icon="glyphicon-cog" />
    <b-collapse id="trackingSettings" visible>
      <div class="card">
        <form id="trackingConfiguration" class="tracking-configuration" name="tracking-configuration">
          <!-- Configuration Inputs -->
          <div v-for="(item, key) in trackingConfig">
            <div class="tracking-item">
              <div v-if="item.input_type === 'select'" class="form-group">
                <div>
                  <label :for="`trk-${item.name}`">{{ item.label }}</label>
                </div>
                <div>
                  <el-select
                    v-validate="'required'"
                    class="float-left width-full"
                    :name="`trk-${item.name}`"
                    :value="trackingData[`trk-${key}`]"
                    placeholder=""
                    :data-vv-as="item.label"
                    @input="onInputChange(`trk-${item.name}`, $event)">
                    <el-option
                      v-for="value in item.options"
                      :key="value"
                      :label="value"
                      :value="value" />
                  </el-select>
                </div>
                <span
                  v-show="errors.has(`trk-${item.name}`)"
                  class="help is-danger">{{ errors.first(`trk-${item.name}`) }}
            </span>
              </div>
              <div v-else-if="item.input_type === 'hidden'" class="form-group">
                <input
                  type="hidden"
                  :name="`trk-${item.name}`"
                  :value="trackingData[`trk-${key}`]">
              </div>
              <div v-else class="form-group">
                <div>
                  <label :for="`trk-${item.name}`">{{ item.label }}</label>
                </div>
                <div>
                  <el-input
                    v-validate="'required'"
                    :name="`trk-${item.name}`"
                    :value="trackingData[`trk-${key}`]"
                    :controls="false"
                    class="float-left"
                    :data-vv-as="item.label"
                    @input="onInputChange(`trk-${item.name}`, $event)"
                    @blur="onBlur(`trk-${item.name}`, $event.target.value)" />
                </div>
                <span
                  v-show="errors.has(`trk-${item.name}`)"
                  class="help is-danger">{{ errors.first(`trk-${item.name}`) }}
            </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </b-collapse>
  </div>
</template>

<script>
  import TrackingMixin from './mixins/trackingMixin';
  import LabelItemContainer from '../common/containers/LabelItemContainer.vue';

  export default {
    components: {
      LabelItemContainer,
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
        this.onInputChange(key, value.replace(/[^a-zA-Z0-9_\[\]]/g, ''));
      }
    }
  };
</script>
<style lang="less" scoped>
.width-full {
  width: 100%;
}
</style>

<style lang="less">
</style>
