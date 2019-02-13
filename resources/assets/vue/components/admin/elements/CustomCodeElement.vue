<template>
  <element-container :component="component" @select-component="selectComponentHandler">
    <div class="stx-wraper" v-html="component.code.data || emptyMessage" />
  </element-container>
</template>

<script>
import ElementMixin from '../../common/mixins/ElementMixin';
import ElementContainer from '../../common/containers/ElementContainer.vue';

export default {
  name: 'CustomCodeElement',
  components: {
    ElementContainer,
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
