<template>
  <module-container :component="component" @select-component="selectComponentHandler">
    <!-- HTML ELEMENT -->
    <div class="stx-wraper" v-html="component.code.data">
    </div>
    <!-- ! HTML ELEMENT -->
  </module-container>
</template>

<script>
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';

  export default {
    name: 'CustomCode',
    mixins: [ElementMixin],
    components: {
      ModuleContainer
    },
  };
</script>