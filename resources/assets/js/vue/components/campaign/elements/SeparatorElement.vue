<template id="separator-element">
  <!-- SEPARATOR ELEMENT -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td :bgcolor="backgroundColor" class="st-separator" :style="component.style.default">
        <table style="width:100%;" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td :width="separatorWidth" :height="separatorHeight"></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!-- SEPARATOR ELEMENT ENDS -->
</template>

<script>
  export default {
    name: 'SeparatorElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    created () {
      this.setupModule();
    },
    methods: {
      setupModule () {
        this.backgroundColor = this.component.style.default.backgroundColor;
        this.separatorHeight = this.component.height;
        this.separatorWidth = this.component.width;
      }
    }
  };
</script>