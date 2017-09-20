<template >
  <div>

    <tr v-if="module.type === 'custom'" class="st-module-wrapper">
      <td class="st-toolbar-content st-position-relative">
        <component v-if="$customModules.indexOf('custom-' + module.name) !== -1" :is="'custom-' + module.name" :name="module.name" :module="module"></component>
        <module-toolbar :module-id="moduleId"></module-toolbar>
      </td>
    </tr>


  </div>
</template>

<script>

  import TextElement from './elements/TextElement.vue';
  import ButtonElement from './elements/ButtonElement.vue';
  import ImageElement from './elements/ImageElement.vue';
  import DividerElement from './elements/DividerElement.vue';
  import ModuleToolbar from './partials/ModuleToolbar.vue';

  module.exports = {
    name: 'Module',
    props: ['moduleId'],
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
    },
    methods: {
      setComponent(ref) {
        this.$store.commit("campaign/setCurrentComponent", ref);
      },
    },
    components: {
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement,
      'module-toolbar': ModuleToolbar,
    }
  };
</script>
