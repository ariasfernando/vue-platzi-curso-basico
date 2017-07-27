<template>
  <!-- DIVIDER ELEMENT -->
  <tr @click="setComponent" data-type="divider-element">
    <td :bgcolor="backgroundColor" class="st-separator st-position-relative" :style="component.style">
      <table style="width:100%;" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td :width="separatorWidth" :height="separatorHeight"></td>
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
      setComponent() {
        this.$store.commit("module/setCurrentComponent", {
          columnId: this.columnId,
          componentId: this.componentId
        });
      }
    }
  };
</script>