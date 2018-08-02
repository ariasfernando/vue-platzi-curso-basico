<template>
    <table width="680" align="center" bgcolor="#002A49" class="st-wrapper" cellspacing="0" cellpadding="0" border="0" style="width: 680px; background-color: #002A49;" :style="`background-image:url(${imageUrl(backgroundImage, 'desktop')})`">
      <tr>
        <td width="100%" style="vertical-align: top; width: 100%; border-left: 4px solid #dde6ed; border-right: 4px solid #dde6ed;">
            <!-- YOUR ELEMENT HERE -->
            <table width="600" align="center" class="st-wrapper" cellspacing="0" cellpadding="0" border="0" style="width: 600px;">
                <tr>
                    <td width="100%" class="st-mobile-padding2" style="vertical-align: top; width: 100%; padding: 30px 70px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <!-- EYEBROW -->
                            <tr>
                                <td width="100%" align="left" style="width: 100%;">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="width: 100%;">
                                        <tr>
                                            <td width="100%" align="center" valign="bottom" style="width: 100%; font-family:'Lato', Helvetica Neue, Helvetica, Arial, Sans Serif; font-size: 10px; line-height: 12px; color: #F5F6F8; text-decoration: none; font-weight: normal; padding-bottom: 30px;position:relative">
                                              <div :class="'st-remove-element stx-toolbar toolbar-'+eyebrowEditorId"></div>
                                              <div
                                              data-key="text"
                                              v-html="module.data.eyebrow  ? module.data.eyebrow : module.params.eyebrow.content"
                                              :id="eyebrowEditorId"
                                              :module-id="moduleId">
                                              </div> 
                                            </td>
                                        </tr>   
                                    </table>
                                </td>
                            </tr>
                            <!-- EYEBROW -->
                            <!-- HEADER -->
                            <tr>
                                <td width="100%" align="center" style="width: 100%;">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="width: 100%;">
                                        <tr>
                                            <td width="100%" align="center" valign="bottom" style="width: 100%; font-family:'Lato', Helvetica Neue, Helvetica, Arial, Sans Serif; font-size: 36px; line-height: 54px; color: #F9F9F9; text-decoration: none; font-weight: 300; padding-bottom: 25px;position:relative">
                                              <div :class="'st-remove-element stx-toolbar toolbar-'+headerEditorId"></div>
                                              <div
                                              data-key="text"
                                              v-html="module.data.header  ? module.data.header : module.params.header.content"
                                              :id="headerEditorId"
                                              :module-id="moduleId">
                                              </div> 
                                            </td>
                                        </tr>   
                                    </table>
                                </td>
                            </tr>
                            <!-- HEADER -->
                            <!-- BODY TEXT -->
                            <tr>
                                <td width="100%" align="center" style="width: 100%; padding-bottom: 25px;">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0" style="width: 100%">
                                        <tr>
                                            <td 
                                            v-for="(column, componentId) in customIcons"
                                            :key="componentId"
                                            width="50%" 
                                            align="center" 
                                            style="width: 50%;">
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="width: 100%;">
                                                    <tr>
                                                        <td width="30" align="left" style="width: 30px; padding-right: 5px;">
                                                            <img
                                                            :src="imageUrl(column.imageIndex, 'desktop')"
                                                            width="30" 
                                                            height="30"
                                                            border="0"
                                                            @click="setCustomComponent(moduleId, module.params.customIcons.columnId, componentId, 'customIcons')"
                                                            style="border: 0; display: block;">
                                                        </td>
                                                        <td 
                                                        v-if="componentId == 0"
                                                        width="100%" 
                                                        align="left" 
                                                        valign="bottom" 
                                                        style="width: 100%; font-family:'Lato', Helvetica Neue, Helvetica, Arial, Sans Serif; font-size: 16px; line-height: 28px; color: #F5F6F8; text-decoration: none; font-weight: normal;position:relative">
                                                            <div :class="'st-remove-element stx-toolbar toolbar-'+bodytext0EditorId"></div>
                                                            <div
                                                            data-key="text"
                                                            v-html="bodytext0Content"
                                                            @keyup="e => changeContent(e,'bodytext0')"
                                                            @tiny-change="e => changeContent(e, 'bodytext0')"
                                                            @input="e => changeContent(e, 'bodytext0')"
                                                            :id="bodytext0EditorId"
                                                            :module-id="moduleId">
                                                            </div>   
                                                        </td>
                                                        <td 
                                                        v-else-if="componentId == 1"
                                                        width="100%" 
                                                        align="left" 
                                                        valign="bottom" 
                                                        style="width: 100%; font-family:'Lato', Helvetica Neue, Helvetica, Arial, Sans Serif; font-size: 16px; line-height: 28px; color: #F5F6F8; text-decoration: none; font-weight: normal;position:relative">
                                                            <div :class="'st-remove-element stx-toolbar toolbar-'+bodytext1EditorId"></div>
                                                            <div
                                                            data-key="text"
                                                            v-html="bodyText1Content"
                                                            @keyup="e => changeContent(e, 'bodytext1')"
                                                            @tiny-change="e => changeContent(e, 'bodytext1')"
                                                            @input="e => changeContent(e, 'bodytext1')"
                                                            :id="bodytext1EditorId"
                                                            :module-id="moduleId">
                                                            </div>   
                                                        </td>
                                                    </tr>   
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- BODY TEXT -->
                            <!-- CTA -->
                            <tr>
                                <td width="100%" align="center" style="width: 100%; padding: 10px 0px;">
                                        <a
                                        target="_blank"
                                        :href="ctaButton.href"
                                        :data-description="getCustomComponentDataDescriptionByIndex('ctaButton',0)"
                                        style="font-family:'Lato', Helvetica Neue, Helvetica, Arial, Sans Serif; font-size: 14px; line-height: 14px; color: #ffffff; text-decoration: none; font-weight: normal; vertical-align: middle;"
                                        @click="setCustomComponent(moduleId, module.params.ctaButton.columnId, 0, 'ctaButton')">
                                        <table bgcolor="#0061D5" border="0" cellpadding="0" cellspacing="0" style="min-width: 180px;  border-radius: 2px;background: #0061D5;">
                                            <tr>
                                                <td width="100%" align="center" height="40" style="width: 100%; height:40px; font-family:'Lato', Helvetica Neue, Helvetica, Arial, Sans Serif; font-size: 14px; line-height: 14px; color: #ffffff; text-decoration: none; font-weight: normal; vertical-align: middle; padding: 0px 40px; position:relative;">
                                                  <span style="font-family:'Lato', Helvetica Neue, Helvetica, Arial, Sans Serif; font-size: 14px; line-height: 14px; color: #ffffff; text-decoration: none; font-weight: normal; vertical-align: middle;">
                                                    <div :class="'st-remove-element stx-toolbar toolbar-'+ctaEditorId"></div>
                                                    <div
                                                    data-key="text"
                                                    v-html="module.data.cta  ? module.data.cta : module.params.cta.content"
                                                    :id="ctaEditorId"
                                                    :module-id="moduleId">
                                                    </div> 
                                                  </span>  
                                                </td>
                                            </tr>
                                        </table>
                                    </a>
                                </td>
                            </tr>
                            <!-- CTA -->
                        </table>                
                    </td>
                </tr>
            </table>
            <!-- YOUR ELEMENT HERE -->                 
        </td>
    </tr>
  </table>
</template>


<script>
  import _ from 'lodash';
  import mixinTiny from '../../mixins/tinymce';
  import mixinCustomView from '../../mixins/view';
	import mixinImages from '../../mixins/images'; 
	

  export default {
    props: ['moduleId'],
    mixins: [
        mixinCustomView, 
        mixinTiny,
        mixinImages
    ],
    data(){
      return {
        timer: null,
        bodytext0Content: "",
        bodyText1Content: ""
      };
		},
		mounted(){
			const moduleInstance = this.$store.getters["campaign/modules"][this.moduleId];
			this.bodytext0Content= moduleInstance.data.bodytext0  ? moduleInstance.data.bodytext0 : moduleInstance.params.bodytext0.content;
			this.bodytext1Content= moduleInstance.data.bodytext1  ? moduleInstance.data.bodytext1 : moduleInstance.params.bodytext1.content;
      
		},
    computed: {
      campaign() {
        return this.$store.getters["campaign/campaign"];
      },

      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      eyebrowEditorId() {
        return ['editor', this.moduleId, "eyebrow"].join('-');
      },
      headerEditorId() {
        return ['editor', this.moduleId, "header"].join('-');
      },
      bodytext0EditorId() {
        return ['editor', this.moduleId, "bodytext0"].join('-');
      },
      bodytext1EditorId() {
        return ['editor', this.moduleId, "bodytext1"].join('-');
      },
      ctaEditorId() {
        return ['editor', this.moduleId, "cta"].join('-');
      },
      customIcons() {
        return "customIcons" in this.module.data ? this.module.data.customIcons : this.module.params.customIcons.defaultValues;
      },
      ctaButton() {
        return "ctaButton" in this.module.data ? this.module.data.ctaButton : this.module.params.ctaButton.defaultValues;
      },
      backgroundImage() {
        return "backgroundImage" in this.module.data ? this.module.data.backgroundImage : this.module.params.backgroundImage.defaultValues;
      },
      
    },
    methods: {
      config(){
        this.$store.commit("campaign/setCustomModule", this.moduleId);
        this.$store.commit("campaign/unsetCurrentModule");
      },
      initTiny () {
        // Init eyebrow text
        this.initTinyMCE({
          id: this.eyebrowEditorId,
          fixed_toolbar_container: `.toolbar-${this.eyebrowEditorId}`,
          toolbar: 'stformatsmenu italic styleselect superscript link ',
          plugins: 'paste advlist autolink lists textcolor stlinkextended stformatsmenu',
          target_list: false,
          link_title: false,
          link_color_default: "#0061D5",
          link_text_to_display: false,
          forced_root_block_attrs: {
            'style': 'margin: 0;'
          },
          st_formats_menu: [
              {
                  'text': 'Regular',
                  'value': 'normal_font'
              },
              {
                  'text': 'Bold',
                  'value': 'bold_font'
              }
          ],
          formats: {
              normal_font: {inline: 'span', styles: {'fontWeight': '400'}},
              bold_font: {inline: 'span', styles: {'fontWeight': '700'}}
          },
          style_formats: [
            { 'title': '8px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '8px', 
                  'line-height': '10px',
                  'margin': '0' 
              } 
            },
            { 'title': '10px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '10px', 
                  'line-height': '12px',
                  'margin': '0' 
              }
            },
            { 'title': '12px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '12px', 
                  'line-height': '14px',
                  'margin': '0' 
              } 
            },
            { 'title': '14px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '14px', 
                  'line-height': '17px',
                  'margin': '0' 
              } 
            },
            { 'title': '16px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '16px', 
                  'line-height': '19px',
                  'margin': '0' 
              } 
            },
          ]
        });

        // Init header text
        this.initTinyMCE({
          id: this.headerEditorId,
          fixed_toolbar_container: `.toolbar-${this.headerEditorId}`,
          toolbar: 'stformatsmenu italic styleselect superscript',
          plugins: 'paste advlist autolink lists textcolor stlinkextended stformatsmenu',
          target_list: false,
          link_title: false,
          link_color_default: "#0061D5",
          link_text_to_display: false,
          forced_root_block_attrs: {
            'style': 'margin: 0;'
          },
          st_formats_menu: [
              {
                  'text': 'Regular',
                  'value': 'normal_font'
              },
              {
                  'text': 'Bold',
                  'value': 'bold_font'
              }
          ],
          formats: {
              normal_font: {inline: 'span', styles: {'fontWeight': '400'}},
              bold_font: {inline: 'span', styles: {'fontWeight': '700'}}
          },
          style_formats: [
            { 'title': '26px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '26px', 
                  'line-height': '39px',
                  'margin': '0' 
              } 
            },
            { 'title': '28px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '28px', 
                  'line-height': '42px',
                  'margin': '0' 
              }
            },
            { 'title': '30px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '30px', 
                  'line-height': '45px',
                  'margin': '0' 
              } 
            },
            { 'title': '32px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '32px', 
                  'line-height': '48px',
                  'margin': '0' 
              } 
            },
            { 'title': '34px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '34px', 
                  'line-height': '51px',
                  'margin': '0' 
              } 
            },
            { 'title': '36px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '36px', 
                  'line-height': '54px',
                  'margin': '0' 
              } 
            },
            { 'title': '38px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '38px', 
                  'line-height': '57px',
                  'margin': '0' 
              } 
            },
            { 'title': '40px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '40px', 
                  'line-height': '60px',
                  'margin': '0' 
              } 
            },
            { 'title': '42px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '42px', 
                  'line-height': '63px',
                  'margin': '0' 
              } 
            },
            { 'title': '44px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '44px', 
                  'line-height': '66px',
                  'margin': '0' 
              } 
            },
            { 'title': '46px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '46px', 
                  'line-height': '69px',
                  'margin': '0' 
              } 
            },
          ]
        });

        // Init bodytext0 text
        this.initTinyMCE({
          id: this.bodytext0EditorId,
          fixed_toolbar_container: `.toolbar-${this.bodytext0EditorId}`,
          toolbar: 'stformatsmenu italic styleselect superscript',
          plugins: 'paste advlist autolink lists textcolor stlinkextended stformatsmenu',
          target_list: false,
          link_title: false,
          link_color_default: "#0061D5",
          link_text_to_display: false,
          forced_root_block_attrs: {
            'style': 'margin: 0;'
          },
          st_formats_menu: [
              {
                  'text': 'Regular',
                  'value': 'normal_font'
              },
              {
                  'text': 'Bold',
                  'value': 'bold_font'
              }
          ],
          formats: {
              normal_font: {inline: 'span', styles: {'fontWeight': '400'}},
              bold_font: {inline: 'span', styles: {'fontWeight': '700'}}
          },
          style_formats: [
            { 'title': '12px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '12px', 
                  'line-height': '21px',
                  'margin': '0' 
              } 
            },
            { 'title': '14px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '14px', 
                  'line-height': '24px',
                  'margin': '0' 
              }
            },
            { 'title': '16px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '16px', 
                  'line-height': '28px',
                  'margin': '0' 
              } 
            },
            { 'title': '18px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '18px', 
                  'line-height': '31px',
                  'margin': '0' 
              } 
            },
            { 'title': '20px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '20px', 
                  'line-height': '35px',
                  'margin': '0' 
              } 
            },
          ]
        });

        // Init bodytext1 text
        this.initTinyMCE({
          id: this.bodytext1EditorId,
          fixed_toolbar_container: `.toolbar-${this.bodytext1EditorId}`,
          toolbar: 'stformatsmenu italic styleselect superscript',
          plugins: 'paste advlist autolink lists textcolor stlinkextended stformatsmenu',
          target_list: false,
          link_title: false,
          link_color_default: "#0061D5",
          link_text_to_display: false,
          forced_root_block_attrs: {
            'style': 'margin: 0;'
          },
          st_formats_menu: [
              {
                  'text': 'Regular',
                  'value': 'normal_font'
              },
              {
                  'text': 'Bold',
                  'value': 'bold_font'
              }
          ],
          formats: {
              normal_font: {inline: 'span', styles: {'fontWeight': '400'}},
              bold_font: {inline: 'span', styles: {'fontWeight': '700'}}
          },
          style_formats: [
            { 'title': '12px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '12px', 
                  'line-height': '21px',
                  'margin': '0' 
              } 
            },
            { 'title': '14px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '14px', 
                  'line-height': '24px',
                  'margin': '0' 
              }
            },
            { 'title': '16px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '16px', 
                  'line-height': '28px',
                  'margin': '0' 
              } 
            },
            { 'title': '18px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '18px', 
                  'line-height': '31px',
                  'margin': '0' 
              } 
            },
            { 'title': '20px', 
              'block': 'p', 
              'styles': { 
                  'font-size': '20px', 
                  'line-height': '35px',
                  'margin': '0' 
              } 
            },
          ]
        });

        // Init CTA text
        this.initTinyMCE({
          id: this.ctaEditorId,
          fixed_toolbar_container: `.toolbar-${this.ctaEditorId}`,
          toolbar: 'stformatsmenu',
          plugins: 'paste advlist autolink lists stformatsmenu',
          st_formats_menu: [
              {
                  'text': 'Regular',
                  'value': 'normal_font'
              },
              {
                  'text': 'Bold',
                  'value': 'bold_font'
              }
          ],
          formats: {
              normal_font: {inline: 'span', styles: {'fontWeight': '400'}},
              bold_font: {inline: 'span', styles: {'fontWeight': '700'}}
          },
          target_list: false,
          link_title: false,
          link_color_default: "#0061D5",
          max_lines: '1',
          link_text_to_display: false,
          forced_root_block_attrs: {
            'style': 'margin: 0;'
          },
          
        });
      },
    }
  }
</script>