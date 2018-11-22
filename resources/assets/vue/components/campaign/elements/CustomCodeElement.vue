<template>
  <module-container :component="component" @select-component="selectComponentHandler">
    <div class="stx-wraper" v-html="this.component.code.data"></div>
  </module-container>
</template>

<script>
import _ from 'lodash';
import ElementMixin from '../../common/mixins/ElementMixin.js';
import ModuleContainer from '../../common/containers/ModuleContainer';

export default {
  name: 'CustomCodeElement',
  components: {
    ModuleContainer
  },
  mixins: [ElementMixin],
};
</script>
<style lang="scss">
.stx-position-relative {
  position: relative;
}
</style>