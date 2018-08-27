<template>
  <div>
    <settings-container :no-label="true">
      <template slot="setting-bottom">
        <el-button @click="getModal" type="primary">
          <i class="fa fa-code"></i>
          Edit Code
        </el-button>
      </template>
    </settings-container>
    <modal-container v-if='showModal === true' @close-modal="showModal = false">
      <codemirror ref="myCm"
        v-model="code"
        :options="cmOptions"
      />
      <Button @click="saveChange" class="stop-editing-button">End Editing Code</Button>
    </modal-container>
  </div>
</template>
<script>
import SettingMixin from '../mixins/SettingMixin.js';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';
import ModalContainer from '../../common/containers/ModalContainer.vue';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/theme/duotone-light.css';

export default {
  name: 'generic-code',
  mixins: [SettingMixin],
  components: {
    SettingsContainer,
    ModalContainer,
    codemirror
  },
  data() {
    return {
      showModal: false,
      code: '',
      cmOptions: {
        mode: 'htmlmixed',
        theme: 'duotone-light',
        lineNumbers: true
      }
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
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-codemirror {
  clear: both;
}
.stop-editing-button {
  position: absolute;
  right: 2rem;
  margin-top: -12px;
}

.el-button {
  border-color: rgb(120, 220, 214);
  background-color: rgb(120, 220, 214);
  width: 100%;
  font-size: 12px;
  font-weight: 300;
  padding: 6px 20px;
  border-radius: 2px;
  margin-top: 5px;
}

.el-button--primary {
  &.is-disabled,
  &.is-disabled:active,
  &.is-disabled:focus,
  &.is-disabled:hover {
    opacity: 0.4;
    border-color: rgb(120, 220, 214);
    background-color: rgb(120, 220, 214);
    margin-left: 0px;
  }
}
</style>