<template>
  <element-container :component="component" @select-component="selectComponentHandler">
    <div class="stx-wraper" v-html="this.component.code.data"></div>
  </element-container>
</template>

<script>
import _ from 'lodash';
import ElementMixin from '../../common/mixins/ElementMixin.js';
import ElementContainer from '../../common/containers/ElementContainer';

export default {
  name: 'CustomCodeElement',
  components: {
    ElementContainer
  },
  mixins: [ElementMixin],
};
</script>
<style lang="scss">
.stx-position-relative {
  position: relative;
}
</style>
