<template>
  <table
    width="600"
    dir="rtl"
    bgcolor="#ffffff"
    class="st-wrapper4"
    cellspacing="0"
    cellpadding="0"
    border="0"
    align="center"
    style="width: 600px;"
    >
    <tr>
      <td
        width="100%"
        align="center"
        >
        <comment
          :content="msoStartingComment"
          ></comment>
        <table
          width="300"
          cellpadding="0"
          cellspacing="0"
          border="0"
          align="right"
          style="width: 300px;"
          dir="ltr"
          >
          <tr>
            <td
              width="100%"
              style="width: 100%;"
              >
              <table
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width: 100%;"
                >
                <tr>
                  <td
                    width="100%"
                    class="reset-padding"
                    style="width: 100%; padding: 0px 40px 0px 20px;"
                    >
                    <table
                      style="width:100%!important;"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      >
                      <tr>
                        <td
                          style="vertical-align:top;"
                          width="100%"
                          valign="top"
                          align="center"
                          bgcolor="#ffffff"
                            v-if="module.data.texto1.enableElement"
                            >hola
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <comment
          :content="msoMiddleComment"
          ></comment>
        <table
          width="300"
          cellpadding="0"
          cellspacing="0"
          border="0"
          align="left"
          style="width: 300px;"
          dir="ltr"
          >
          <tr>
            <td
              width="100%"
              class="mob-padding"
              valign="top"
              style="width: 100%; padding: 0px 20px 0px 40px;"
              >
              <table
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width: 100%;"
                >
                <tr>
                  <td
                    width="100%"
                    style="width: 100%;"
                    >
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      align="center"
                      style="width: 100%;"
                      >
                      <tr>
                        <div
                          :class="'st-remove-element stx-toolbar toolbar-' + editorId"
                          ></div>
                        <td
                          style="vertical-align:top;"
                          width="100%"
                          valign="top"
                          align="center"
                          bgcolor="#ffffff"
                            v-if="module.data.texto2.enableElement"
                            >hola2
                        </td>
                      </tr>   
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <comment
          :content="msoEndingComment"
          ></comment>
      </td>
    </tr>
  </table>
</template>

<script>
  export default {
    props: ['moduleId'],
    computed: {
      campaign() {
        return this.$store.getters["campaign/campaign"];
      },
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      editorId() {
        return ['editor', this.module.idInstance, "text"].join('-');
      },
      colorMap() {
        var libraryKey = this.$store.state.campaign.campaign.library_config.key;
        if(!this.module.params.colors[libraryKey]){
          libraryKey = 'default';
        }
        return this.module.params.colors[libraryKey];
      },
      linkColor(){
        return this.module.params.linkColor;
      },
      textFontStyles(){
        return {
          'width': "100%",
          'font-family': this.campaign.library_config.fontFamily,
          'font-size': '13px',
          'line-height': "18px",
          'color': '#77787b',
          'text-decoration': 'none',
          'font-weight': 'normal'
        };
      },
      msoStartingComment() {
        return '[if gte mso 9]>' +
          '<table width="600" border="0" cellspacing="0" cellpadding="0" style="width: 600px;" dir="rtl">' +
          '<tr>' +
          '<td width="300" align="left" valign="top" style="width: 300px;" dir="ltr">' +
          '<![endif]';
      },
      msoMiddleComment() {
        return '[if gte mso 9]>' +
          '</td>' +
          '<td width="300" align="left" valign="top" style="width: 300px;" dir="ltr">' +
          '<![endif]';
      },
      msoEndingComment() {
        return '[if gte mso 9]>' +
          '</td>' +
          '</tr>' +
          '</table>' +
          '<![endif]';
      }
    },
    methods: {
      initTiny() {
        // Init body text editor
        this.initTinyMCE({
          id: this.editorId,
          fixed_toolbar_container: `.toolbar-${this.editorId}`,
          toolbar: 'bold superscript numlist bullist forecolor link',
          target_list: false,
          link_title: false,
          link_text_to_display: false,
          max_chars: 1000,
          link_fixed_color: this.linkColor,
          textcolor_map: this.colorMap,
          forced_root_block_attrs: {
            'style': 'margin: 0;'
          }
        })
      }
    }
  }
</script>
