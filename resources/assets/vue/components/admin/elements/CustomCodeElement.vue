<template>
  <module-container :component="component" @select-component="selectComponentHandler">
    <div class="stx-wraper" v-html="this.component.code.data || this.emptyMessage"></div>
    <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
  </module-container>
</template>

<script>
import _ from 'lodash';
import ComponentToolbar from './ComponentToolbar.vue';
import ElementMixin from '../../common/mixins/ElementMixin.js';
import ModuleContainer from '../../common/containers/ModuleContainer';

export default {
  name: 'CustomCodeElement',
  components: {
    ComponentToolbar,
    ModuleContainer
  },
  mixins: [ElementMixin],
  data() {
    return {
      emptyMessage: 
        '<div style="text-align: center;">Click to edit <strong>HTML</strong></div>',
    };
  },
};
</script>
<style lang="scss">
.stx-position-relative {
  position: relative;
}
</style>