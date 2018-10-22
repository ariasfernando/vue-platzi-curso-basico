<template>
  <tr>
    <td
      width="100%"
      :valign="valign || 'top'"
      :align="align"
      :bgcolor="bgcolor"
      :height="localHeight"
      style="display:block; margin:0 auto; font-size: 0; line-height: 0; width: 100%;"
      :style="innerTdStyle"
      :data-persist-styles="JSON.stringify(dataPersistStyles)"
    >&nbsp;</td>
  </tr>
</template>

<script>
export default {
  name: 'Spacer',
  props: ['valign', 'align', 'bgcolor', 'height'],
  data() {
    return {
      dataPersistStyles: {
        '-webkit-text-size-adjust': '100%',
        '-ms-text-size-adjust': '100%',
        'mso-line-height-rule': 'exactly',
        'mso-table-lspace': '0pt',
        'mso-table-rspace': '0pt',
      },
    };
  },
  computed: {
    localHeight() {
      return _.parseInt(this.height);
    },
    innerTdStyle() {
      return {
        height: `${this.localHeight}px`,
        maxHeight: `${this.localHeight}px`,
      };
    },
  },
};
</script>
