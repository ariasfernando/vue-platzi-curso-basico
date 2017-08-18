<template>
  <!-- DIVIDER ELEMENT -->
    <tr data-type="divider-element" @click.prevent="setComponent">
      <td class="st-separator st-position-relative" :style="component.style" :align="component.attribute.align">
        <table style="width:100%;" width="100%" cellpadding="0" cellspacing="0" border="0"
              :width="component.attribute.width"
              :height="component.attribute.height"
              :bgcolor="component.attribute.bgcolor">
          <tr>
            <td :style="component.style"
                :bgcolor="component.attribute.bgcolor"
                :height="component.attribute.height">
              <div :style="component.style"></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  <!-- DIVIDER ELEMENT ENDS -->
</template>

<script>
  export default {
    name: 'DividerElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    data () {
      return {
        backgroundColor: '',
        separatorHeight: '',
        separatorWidth: ''
      }
    },
    created () {
      this.setupModule();
    },
    methods: {
      setupModule () {
        this.backgroundColor = this.component.style.backgroundColor;
        this.separatorHeight = this.component.height;
        this.separatorWidth = this.component.width;
      },
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("campaign/setCurrentComponent", {
            moduleId: this.moduleId,
            columnId: this.columnId,
            componentId: this.componentId
          });
        }
      },
    }
  };
</script>