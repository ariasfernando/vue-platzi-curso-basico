<template>
  <div>
    <settings-container :no-label="true">
      <template slot="setting-bottom">
        <el-button @click="switchEditing" type="primary">
          <i class="glyphicon glyphicon-cloud-upload"></i>
          Edit Code
        </el-button>
      </template>
    </settings-container>
    <div class="modalLikeVeil" v-if='editing === true'>
      <div class="modalLike" v-if='editing === true'>
        <div @click="switchEditing" class="close-button">X</div>
        <codemirror ref="myCm"
          v-model="code"
          :options="cmOptions"
        />
        <Button @click="saveChange" class="stop-editing-button">End Editing HTML</Button>
      </div>
    </div>
  </div>
</template>
<script>
import SettingMixin from '../mixins/SettingMixin.js';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/theme/duotone-light.css';

export default {
  name: 'generic-code',
  mixins: [SettingMixin],
  components: {
    SettingsContainer,
    codemirror
  },
  data() {
    return {
      editing: false,
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
      this.editing = !this.editing;
    },
    switchEditing() {
      this.code = this.mainSetting;
      this.editing = !this.editing;
    }
  }
};
</script>

<style lang="scss" scoped>
.close-button {
  float: right;
  color: red;
  font-weight: 900;
  clear: both;
  cursor: pointer;
}
.vue-codemirror {
  clear: both;
}
.stop-editing-button {
  position: absolute;
  right: 2rem;
  margin-top: -12px;
}

.modalLikeVeil {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.37);
  z-index: 1000;

  > .modalLike {
    position: fixed;
    top: 10vh;
    left: 10vw;
    right: 10vw;
    background: white;
    padding: 2rem;
    border: 1px solid #f0f0f0;
  }
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