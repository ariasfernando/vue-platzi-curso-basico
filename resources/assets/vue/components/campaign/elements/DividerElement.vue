<template>
  <!-- DIVIDER ELEMENT -->
    <tr data-type="divider-element">
      <td class="st-separator st-position-relative" :style="component.style">
        <table style="width:100%;" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td :style="component.style"></td>
          </tr>
        </table>
        <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div> 
        <div class="icon-remove st-remove"  @click="removeComponent"><i class="glyphicon glyphicon-remove-sign st-remove"></i></div>
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
      setComponent() {
        this.$store.commit("module/setCurrentComponent", {
          columnId: this.columnId,
          componentId: this.componentId
        });
      }
    }
  };
</script>