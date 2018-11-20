<template>
  <module-container :component="component" @select-component="selectComponentHandler">
    <div class="stx-wraper" v-html="component.code.data || emptyMessage" />
    <component-toolbar v-if="isStudio" :component-id="componentId" :column-id="columnId" />
  </module-container>
</template>

<script>
import ComponentToolbar from './ComponentToolbar.vue';
import ElementMixin from '../../common/mixins/ElementMixin';
import ModuleContainer from '../../common/containers/ModuleContainer.vue';

export default {
  name: 'CustomCodeElement',
  components: {
    ComponentToolbar,
    ModuleContainer,
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
