<template>
  <div>
    <div class="row">
      <div class="col-xs-12">
        <stui-switch-desktop-mobile v-model="buildingMode" />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <div class="preview">
          <module-container :building-mode="buildingMode" :width-desktop="640" :width-mobile="480">
            <module :module="module" />
          </module-container>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ModuleContainer from '../common/containers/ModuleContainer.vue';
import Module from './Module.vue';

export default {
  name: 'ModulePreview',
  components: {
    Module,
    ModuleContainer,
  },
  props: {
    module: {
      type: [Object],
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      buildingMode: 'desktop',
    };
  },
};
</script>
<style lang="scss" scoped>
.preview {
  margin-top: 20px;
}
</style>

