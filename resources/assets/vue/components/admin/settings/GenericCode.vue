<template>
  <div>
    <settings-container :no-label="true">
      <template slot="setting-bottom">
        <el-button type="primary" @click="getModal">
          <i class="fa fa-code" />
          Edit Code
        </el-button>
      </template>
    </settings-container>
    <modal-container v-if="showModal === true" button-submit-text="End Editing Code" @submit-modal="saveChange" @close-modal="showModal = false">
      <codemirror
        ref="myCm"
        v-model="code"
        :options="cmOptions" />
    </modal-container>
  </div>
</template>
<script>
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/theme/duotone-light.css';
import { codemirror } from 'vue-codemirror';
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';
import ModalContainer from '../../common/containers/ModalContainer.vue';

export default {
  name: 'GenericCode',
  components: {
    SettingsContainer,
    ModalContainer,
    codemirror,
  },
  mixins: [SettingMixin],
  data() {
    return {
      showModal: false,
      code: '',
      cmOptions: {
        mode: 'htmlmixed',
        theme: 'duotone-light',
        lineNumbers: true,
      },
    };
  },
  methods: {
    saveChange() {
      this.mainSetting = this.code;
      this.showModal = false;
    },
    getModal() {
      this.code = this.mainSetting;
      this.showModal = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.vue-codemirror {
  clear: both;
}
</style>
