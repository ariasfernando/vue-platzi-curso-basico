<template>
  <!-- DIVIDER ELEMENT -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr @click.prevent="setComponent"
        data-type="divider-element"
    >
      <td class="st-separator st-position-relative" 
          :bgcolor="component.style.backgroundColor" 
          :height="component.style.height"
          :width="component.style.width"
          :style="'line-height:'+ component.style.height +';height:'+ component.style.height +';'"
      >
        <table style="width:100%;" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td :bgcolor="component.style.backgroundColor" 
                :height="component.style.height"
                :width="component.style.width"
                :style="'line-height:'+ component.style.height +';height:'+ component.style.height +';'">&nbsp;</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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