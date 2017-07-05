<template>
  <!-- DIVIDER ELEMENT -->
    <tr>
      <td :bgcolor="backgroundColor" class="st-separator" :style="component.style">
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