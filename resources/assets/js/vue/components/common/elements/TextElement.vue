<template>
  <!-- TEXT ELEMENT -->
  <tr @click="setComponent">
    <td width="100%" class="st-text-style" align="center" :style="component.style">
      <tiny-mce :id="editorId" :value="component.text" data-key="text" @input="input"></tiny-mce>
    </td>
  </tr>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';

  export default {
    name: 'TextElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    components: {
      'tiny-mce': TinyMCE
    },
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-')
      }
    },
    timeoutID: null,
    created () {
      this.setupModule();
    },
    methods: {
      setupModule () {
        this.maxLines = null;
        this.truncate = null;

        if (this.component.directives && this.component.directives.maxLines) {
          this.maxLines = this.component.directives.maxLines;
        }

        if (this.component.directives && this.component.directives.truncate) {
          this.truncate = this.component.directives.truncate;
        }

      },
      input (text, key) {
        this.$store.commit('module/updateElement', {
          moduleId: this.moduleId,
          columnId: this.columnId,
          componentId: this.componentId,
          data: {
            text: text
          }
        });
      },
      change (event) {
        clearTimeout(this.$timeoutID);

        this.$timeoutID = setTimeout(() => {
          let text = event.target.innerHTML.trim();
          let key = event.target.dataset.key;

          let edited = {};
          edited[key] = text;

          this.$store.commit('module/updateElement', {
            moduleId: this.moduleId,
            columnId: this.columnId,
            componentId: this.componentId,
            data: edited
          });
        }, 500);
      },
      setComponent() {
        this.$store.commit("module/setCurrentComponent", {
          columnId: this.columnId,
          componentId: this.componentId
        });
      }
    }
  };
</script>