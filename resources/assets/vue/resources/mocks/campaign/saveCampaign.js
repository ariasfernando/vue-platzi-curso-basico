module.exports = {
  campaignId: '5bae3210a7082a001559ec93',
  campaign:
  {
    campaign_name: 'Untitled Email',
    preheader_visible: false,
    tags: [],
    campaign_id: '5bae3210a7082a001559ec93',
    campaign_process: false,
    modules_data: [
      {
        _id: '5b804c95aa96550018023592',
        type: 'studio',
        key: 'body',
        name: 'body',
        structure:
        {
          columnsStacking: 'normal',
          attribute:
          {
            bgcolor: '',
            classes: '',
          },
          mobileClasses: [],
          style:
          {
            paddingTop: '0px',
            paddingLeft: '0px',
            paddingBottom: '0px',
            paddingRight: '0px',
            borderTopWidth: '0px',
            borderTopStyle: 'none',
            borderTopColor: '',
            borderRightWidth: '0px',
            borderRightStyle: 'none',
            borderRightColor: '',
            borderBottomWidth: '0px',
            borderBottomStyle: 'none',
            borderBottomColor: '',
            borderLeftWidth: '0px',
            borderLeftStyle: 'none',
            borderLeftColor: '',
          },
          columns: [
            {
              id: 642696,
              type: 'column-element',
              container:
              {
                style: [],
                attribute:
                {
                  width: '100%',
                },
                styleOption: [],
              },
              content:
              {
                style: [],
                attribute: [],
                styleOption: [],
              },
              components: [
                {
                  id: 682319,
                  type: 'text-element',
                  data:
                  {
                    text: '<p style="margin: 0px;" data-mce-style="margin: 0px;"><br></p>',
                  },
                  container:
                  {
                    style:
                    {
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                    },
                    styleOption: [],
                    attribute: [],
                  },
                  text:
                  {
                    style:
                    {
                      fontFamily: 'Helvetica, Arial, Sans-serif',
                      fontSize: '12px',
                      color: '#000000',
                      fontWeight: 'normal',
                      lineHeight: '16px',
                      align: 'left',
                      letterSpacing: 'normal',
                    },
                    styleOption:
                    {
                      isNormalLetterSpacing: true,
                      isCustomFontWeight: false,
                    },
                    attribute: [],
                  },
                  plugins:
                  {
                    alignment:
                    {
                      name: 'alignment',
                      title: 'Alignment',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options: ['left', 'center', 'right'],
                        defaultValue: 'center',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'text',
                    },
                    backgroundColor:
                    {
                      name: 'background-color',
                      title: 'Background color',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        defaultColors: [
                          '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                          '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                        ],
                        defaultValue: '#ffffff',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    mobileStyles:
                    {
                      name: 'mobile-styles',
                      title: 'Mobile styles',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['styles', 'button', 'divider', 'image', 'text'],
                      config:
                      {
                        settings:
                        {
                          hiddenMobile:
                          {
                            value: false,
                            title: 'Hide in mobile',
                            key: 'hidden_mobile',
                            selector: 'tr',
                            _class: 'st-hide-mobile',
                          },
                          hiddenDesktop:
                          {
                            value: false,
                            title: 'Hide in desktop',
                            key: 'hidden_desktop',
                            selector: 'tr',
                            _class: 'st-hide-desktop',
                          },
                          resetPadding:
                          {
                            value: false,
                            title: 'Reset padding',
                            key: 'reset_padding',
                            selector: 'td:first',
                            _class: 'st-pd-0',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                    },
                    paletteBackgroundColor:
                    {
                      name: 'palette-background-color',
                      title: 'Palette Background color',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options:
                        {
                          bgcolor:
                          {
                            label: 'Background color',
                            key: 'bgcolor',
                            value: false,
                            palette: ['000000', '474646', '79A8C9', 'CD202C'],
                            defaultValue: 'transparent',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    textOptions:
                    {
                      name: 'text-options',
                      title: 'Text Editable',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'text'],
                      config:
                      {
                        options:
                        {
                          undo:
                          {
                            label: 'Undo',
                            key: 'undo',
                            value: true,
                            icon: 'fa fa-undo',
                          },
                          redo:
                          {
                            label: 'Redo',
                            key: 'redo',
                            value: true,
                            icon: 'fa fa-repeat',
                          },
                          bold:
                          {
                            label: 'Bold',
                            key: 'bold',
                            value: true,
                            icon: 'fa fa-bold',
                          },
                          italic:
                          {
                            label: 'Italic',
                            key: 'italic',
                            value: true,
                            icon: 'fa fa-italic',
                          },
                          underline:
                          {
                            label: 'Underline',
                            key: 'underline',
                            value: true,
                            icon: 'fa fa-underline',
                          },
                          strikethrough:
                          {
                            label: 'Strikethrough',
                            key: 'strikethrough',
                            value: true,
                            icon: 'fa fa-strikethrough',
                          },
                          alignleft:
                          {
                            label: 'Align left',
                            key: 'alignleft',
                            value: true,
                            icon: 'fa fa-align-left',
                          },
                          aligncenter:
                          {
                            label: 'Align center',
                            key: 'aligncenter',
                            value: true,
                            icon: 'fa fa-align-center',
                          },
                          alignright:
                          {
                            label: 'Align right',
                            key: 'alignright',
                            value: true,
                            icon: 'fa fa-align-right',
                          },
                          superscript:
                          {
                            label: 'Superscript',
                            key: 'superscript',
                            value: false,
                            icon: 'fa fa-superscript',
                          },
                          fontselect:
                          {
                            label: 'Font',
                            key: 'fontselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-font',
                          },
                          fontsizeselect:
                          {
                            label: 'Font size',
                            key: 'fontsizeselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-text-size',
                          },
                          bullist:
                          {
                            label: 'Bullet list',
                            key: 'bullist',
                            value: true,
                            icon: 'fa fa-list-ul',
                          },
                          numlist:
                          {
                            label: 'Number list',
                            key: 'numlist',
                            value: true,
                            icon: 'fa fa-list-ol',
                          },
                          forecolor:
                          {
                            label: 'Font color',
                            key: 'forecolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-forecolor',
                            textcolor_map: ['000000', 'Black', '474646', 'Gray', '79a8c9', 'Blue', 'cd202c', 'Red'],
                            textcolor_from_library: false,
                            palette_name: '',
                          },
                          backcolor:
                          {
                            label: 'Background color',
                            key: 'backcolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-backcolor',
                          },
                          link:
                          {
                            label: 'Link',
                            key: 'link',
                            value: true,
                            icon: 'fa fa-link',
                          },
                          styleselect:
                          {
                            label: 'Style Format',
                            key: 'styleselect',
                            value: false,
                            icon: 'fa fa-edit',
                          },
                        },
                        settings:
                        {
                          link_validate_url:
                          {
                            title: 'Validate Url',
                            value: true,
                          },
                          truncate:
                          {
                            title: 'Characters Limit',
                            value: true,
                            type: 'number',
                            content: 200,
                          },
                          lines_limit:
                          {
                            title: 'Lines Limit',
                            value: true,
                            type: 'text',
                            content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                          },
                          fontsize_formats:
                          {
                            title: 'Font size',
                            value: true,
                            type: 'text',
                            content: '12px 14px 16px 18px',
                          },
                          style_formats:
                          {
                            title: 'Style format',
                            value: false,
                            type: 'text',
                            content: 0,
                          },
                          link_fixed_color:
                          {
                            title: 'Link fixed color',
                            value: false,
                            type: 'text',
                            dependsOn:
                            {
                              config: 'options',
                              name: 'link',
                            },
                            content: 0,
                          },
                        },
                      },
                      render: false,
                      enabled: true,
                    },
                  },
                }],
              plugins:
              {
                columnBackgroundColor:
                {
                  name: 'column-background-color',
                  title: 'Background color',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    defaultColors: [
                      '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                      '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                    ],
                    defaultValue: '#ffffff',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                verticalAlignment:
                {
                  name: 'vertical-alignment',
                  title: 'Vertical alignment',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    options: ['top', 'middle', 'bottom'],
                    defaultValue: 'middle',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                textColorByBackground:
                {
                  name: 'text-color-by-background',
                  title: 'Text Color by Background',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    lightText: '#FFFFFF',
                    darkText: '#000000',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
              },
            }],
        },
        plugins:
        {
          moduleBackgroundColor:
          {
            name: 'module-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['module'],
            config:
            {
              defaultColors: [
                '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
              ],
              defaultValue: '#ffffff',
            },
            data: [],
            render: true,
            enabled: false,
          },
          textColorByBackgroundForModule:
          {
            name: 'text-color-by-background-for-module',
            title: 'Text Color by Background',
            version: '0.0.1',
            author: 'elias.torres@stensul.com',
            target: ['module'],
            config:
            {
              lightText: '#FFFFFF',
              darkText: '#000000',
            },
            data: [],
            render: true,
            enabled: false,
          },
        },
        status: 'publish',
        updated_at: '2018-08-24 15:01:32',
        created_at: '2018-08-24 14:21:09',
        isFixed: false,
        mandatory: false,
        data: [],
        idInstance: 400418,
      },
      {
        _id: '5b804c95aa96550018023592',
        type: 'studio',
        key: 'body',
        name: 'body',
        structure:
        {
          columnsStacking: 'normal',
          attribute:
          {
            bgcolor: '',
            classes: '',
          },
          mobileClasses: [],
          style:
          {
            paddingTop: '0px',
            paddingLeft: '0px',
            paddingBottom: '0px',
            paddingRight: '0px',
            borderTopWidth: '0px',
            borderTopStyle: 'none',
            borderTopColor: '',
            borderRightWidth: '0px',
            borderRightStyle: 'none',
            borderRightColor: '',
            borderBottomWidth: '0px',
            borderBottomStyle: 'none',
            borderBottomColor: '',
            borderLeftWidth: '0px',
            borderLeftStyle: 'none',
            borderLeftColor: '',
          },
          columns: [
            {
              id: 642696,
              type: 'column-element',
              container:
              {
                style: [],
                attribute:
                {
                  width: '100%',
                },
                styleOption: [],
              },
              content:
              {
                style: [],
                attribute: [],
                styleOption: [],
              },
              components: [
                {
                  id: 682319,
                  type: 'text-element',
                  data:
                  {
                    text: `<p style="margin: 0px;">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor 
                      invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>`,
                  },
                  container:
                  {
                    style:
                    {
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                    },
                    styleOption: [],
                    attribute: [],
                  },
                  text:
                  {
                    style:
                    {
                      fontFamily: 'Helvetica, Arial, Sans-serif',
                      fontSize: '12px',
                      color: '#000000',
                      fontWeight: 'normal',
                      lineHeight: '16px',
                      align: 'left',
                      letterSpacing: 'normal',
                    },
                    styleOption:
                    {
                      isNormalLetterSpacing: true,
                      isCustomFontWeight: false,
                    },
                    attribute: [],
                  },
                  plugins:
                  {
                    alignment:
                    {
                      name: 'alignment',
                      title: 'Alignment',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options: ['left', 'center', 'right'],
                        defaultValue: 'center',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'text',
                    },
                    backgroundColor:
                    {
                      name: 'background-color',
                      title: 'Background color',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        defaultColors: [
                          '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                          '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                        ],
                        defaultValue: '#ffffff',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    mobileStyles:
                    {
                      name: 'mobile-styles',
                      title: 'Mobile styles',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['styles', 'button', 'divider', 'image', 'text'],
                      config:
                      {
                        settings:
                        {
                          hiddenMobile:
                          {
                            value: false,
                            title: 'Hide in mobile',
                            key: 'hidden_mobile',
                            selector: 'tr',
                            _class: 'st-hide-mobile',
                          },
                          hiddenDesktop:
                          {
                            value: false,
                            title: 'Hide in desktop',
                            key: 'hidden_desktop',
                            selector: 'tr',
                            _class: 'st-hide-desktop',
                          },
                          resetPadding:
                          {
                            value: false,
                            title: 'Reset padding',
                            key: 'reset_padding',
                            selector: 'td:first',
                            _class: 'st-pd-0',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                    },
                    paletteBackgroundColor:
                    {
                      name: 'palette-background-color',
                      title: 'Palette Background color',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options:
                        {
                          bgcolor:
                          {
                            label: 'Background color',
                            key: 'bgcolor',
                            value: false,
                            palette: ['000000', '474646', '79A8C9', 'CD202C'],
                            defaultValue: 'transparent',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    textOptions:
                    {
                      name: 'text-options',
                      title: 'Text Editable',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'text'],
                      config:
                      {
                        options:
                        {
                          undo:
                          {
                            label: 'Undo',
                            key: 'undo',
                            value: true,
                            icon: 'fa fa-undo',
                          },
                          redo:
                          {
                            label: 'Redo',
                            key: 'redo',
                            value: true,
                            icon: 'fa fa-repeat',
                          },
                          bold:
                          {
                            label: 'Bold',
                            key: 'bold',
                            value: true,
                            icon: 'fa fa-bold',
                          },
                          italic:
                          {
                            label: 'Italic',
                            key: 'italic',
                            value: true,
                            icon: 'fa fa-italic',
                          },
                          underline:
                          {
                            label: 'Underline',
                            key: 'underline',
                            value: true,
                            icon: 'fa fa-underline',
                          },
                          strikethrough:
                          {
                            label: 'Strikethrough',
                            key: 'strikethrough',
                            value: true,
                            icon: 'fa fa-strikethrough',
                          },
                          alignleft:
                          {
                            label: 'Align left',
                            key: 'alignleft',
                            value: true,
                            icon: 'fa fa-align-left',
                          },
                          aligncenter:
                          {
                            label: 'Align center',
                            key: 'aligncenter',
                            value: true,
                            icon: 'fa fa-align-center',
                          },
                          alignright:
                          {
                            label: 'Align right',
                            key: 'alignright',
                            value: true,
                            icon: 'fa fa-align-right',
                          },
                          superscript:
                          {
                            label: 'Superscript',
                            key: 'superscript',
                            value: false,
                            icon: 'fa fa-superscript',
                          },
                          fontselect:
                          {
                            label: 'Font',
                            key: 'fontselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-font',
                          },
                          fontsizeselect:
                          {
                            label: 'Font size',
                            key: 'fontsizeselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-text-size',
                          },
                          bullist:
                          {
                            label: 'Bullet list',
                            key: 'bullist',
                            value: true,
                            icon: 'fa fa-list-ul',
                          },
                          numlist:
                          {
                            label: 'Number list',
                            key: 'numlist',
                            value: true,
                            icon: 'fa fa-list-ol',
                          },
                          forecolor:
                          {
                            label: 'Font color',
                            key: 'forecolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-forecolor',
                            textcolor_map: ['000000', 'Black', '474646', 'Gray', '79a8c9', 'Blue', 'cd202c', 'Red'],
                            textcolor_from_library: false,
                            palette_name: '',
                          },
                          backcolor:
                          {
                            label: 'Background color',
                            key: 'backcolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-backcolor',
                          },
                          link:
                          {
                            label: 'Link',
                            key: 'link',
                            value: true,
                            icon: 'fa fa-link',
                          },
                          styleselect:
                          {
                            label: 'Style Format',
                            key: 'styleselect',
                            value: false,
                            icon: 'fa fa-edit',
                          },
                        },
                        settings:
                        {
                          link_validate_url:
                          {
                            title: 'Validate Url',
                            value: true,
                          },
                          truncate:
                          {
                            title: 'Characters Limit',
                            value: true,
                            type: 'number',
                            content: 200,
                          },
                          lines_limit:
                          {
                            title: 'Lines Limit',
                            value: true,
                            type: 'text',
                            content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                          },
                          fontsize_formats:
                          {
                            title: 'Font size',
                            value: true,
                            type: 'text',
                            content: '12px 14px 16px 18px',
                          },
                          style_formats:
                          {
                            title: 'Style format',
                            value: false,
                            type: 'text',
                            content: 0,
                          },
                          link_fixed_color:
                          {
                            title: 'Link fixed color',
                            value: false,
                            type: 'text',
                            dependsOn:
                            {
                              config: 'options',
                              name: 'link',
                            },
                            content: 0,
                          },
                        },
                      },
                      render: false,
                      enabled: true,
                    },
                  },
                }],
              plugins:
              {
                columnBackgroundColor:
                {
                  name: 'column-background-color',
                  title: 'Background color',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    defaultColors: [
                      '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                      '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                    ],
                    defaultValue: '#ffffff',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                verticalAlignment:
                {
                  name: 'vertical-alignment',
                  title: 'Vertical alignment',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    options: ['top', 'middle', 'bottom'],
                    defaultValue: 'middle',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                textColorByBackground:
                {
                  name: 'text-color-by-background',
                  title: 'Text Color by Background',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    lightText: '#FFFFFF',
                    darkText: '#000000',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
              },
            }],
        },
        plugins:
        {
          moduleBackgroundColor:
          {
            name: 'module-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['module'],
            config:
            {
              defaultColors: [
                '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
              ],
              defaultValue: '#ffffff',
            },
            data: [],
            render: true,
            enabled: false,
          },
          textColorByBackgroundForModule:
          {
            name: 'text-color-by-background-for-module',
            title: 'Text Color by Background',
            version: '0.0.1',
            author: 'elias.torres@stensul.com',
            target: ['module'],
            config:
            {
              lightText: '#FFFFFF',
              darkText: '#000000',
            },
            data: [],
            render: true,
            enabled: false,
          },
        },
        status: 'publish',
        updated_at: '2018-08-24 15:01:32',
        created_at: '2018-08-24 14:21:09',
        isFixed: false,
        mandatory: false,
        data: [],
        idInstance: 284313,
      },
      {
        _id: '5b9ad7f08e769a00171b0884',
        type: 'studio',
        key: 'button',
        name: 'button',
        structure:
        {
          columnsStacking: 'normal',
          attribute:
          {
            bgcolor: '',
            classes: '',
          },
          mobileClasses: [],
          style:
          {
            paddingTop: '0px',
            paddingLeft: '0px',
            paddingBottom: '0px',
            paddingRight: '0px',
            borderTopWidth: '0px',
            borderTopStyle: 'none',
            borderTopColor: '',
            borderRightWidth: '0px',
            borderRightStyle: 'none',
            borderRightColor: '',
            borderBottomWidth: '0px',
            borderBottomStyle: 'none',
            borderBottomColor: '',
            borderLeftWidth: '0px',
            borderLeftStyle: 'none',
            borderLeftColor: '',
          },
          columns: [
            {
              id: 984849,
              type: 'column-element',
              container:
              {
                style: [],
                attribute:
                {
                  width: '100%',
                },
                styleOption: [],
              },
              content:
              {
                style: [],
                attribute: [],
                styleOption: [],
              },
              components: [
                {
                  id: 432867,
                  type: 'button-element',
                  data:
                  {
                    text: 'Lorem ipsum',
                  },
                  container:
                  {
                    style:
                    {
                      paddingTop: '0px',
                      paddingRight: '0px',
                      paddingBottom: '0px',
                      paddingLeft: '0px',
                    },
                    styleOption:
                    {
                      enableElement: true,
                    },
                    attribute:
                    {
                      align: 'center',
                    },
                  },
                  button:
                  {
                    style:
                    {
                      color: '#FFFFFF',
                      fontFamily: 'Helvetica, Arial, Sans-serif',
                      fontSize: '12px',
                      lineHeight: '14px',
                      textAlign: 'center',
                      fontWeight: 'normal',
                      letterSpacing: 'normal',
                    },
                    styleOption:
                    {
                      isNormalLetterSpacing: true,
                      isCustomFontWeight: false,
                    },
                    attribute:
                    {
                      width: 150,
                      height: 40,
                      align: 'center',
                      bgcolor: '#514960',
                      href: '',
                      valign: 'middle',
                    },
                  },
                  caret:
                  {
                    attribute:
                    {
                      width: '10',
                      height: '10',
                      valign: 'middle',
                    },
                    style:
                    {
                      paddingTop: '0px',
                      paddingRight: '0px',
                      paddingBottom: '0px',
                      paddingLeft: '0px',
                    },
                    styleOption:
                    {
                      isBlockHeight: false,
                      isPxWidth: true,
                    },
                  },
                  plugins:
                  {
                    alignment:
                    {
                      name: 'alignment',
                      title: 'Alignment',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'image', 'text'],
                      config:
                      {
                        options: ['left', 'center', 'right'],
                        defaultValue: 'center',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      hasCampaignSettings: true,
                      subComponent: 'container',
                    },
                    backgroundColor:
                    {
                      name: 'background-color',
                      title: 'Background color',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        defaultValue: '#ffffff',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      hasCampaignSettings: true,
                      subComponent: 'button',
                    },
                    destinationUrl:
                    {
                      name: 'destination-url',
                      title: 'Destination Url',
                      version: '0.0.2',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'image'],
                      config:
                      {
                        options:
                        {
                          _blank: 'unchecked',
                          _self: 'expand',
                          _top: 'new-window',
                        },
                        defaultValue: '_blank',
                        validations:
                        {
                          required: false,
                          url: false,
                        },
                        target: false,
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      validated: false,
                      hasCampaignSettings: true,
                      subComponent: 'button',
                    },
                    fontFamily:
                    {
                      name: 'font-family',
                      title: 'Font family',
                      version: '0.0.1',
                      author: 'facundo.garcia@stensul.com',
                      target: ['button', 'text'],
                      config: [
                        {
                          label: 'option1',
                          value: 'Helvetica, Arial, Sans-serif',
                        },
                        {
                          label: 'option2',
                          value: 'Arial, Sans-serif, Helvetica',
                        }],
                      data: [],
                      render: true,
                      enabled: false,
                      hasCampaignSettings: true,
                      subComponent: 'button',
                    },
                    mobileStyles:
                    {
                      name: 'mobile-styles',
                      title: 'Mobile styles',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['styles', 'button', 'divider', 'image', 'text'],
                      config:
                      {
                        settings:
                        {
                          hiddenMobile:
                          {
                            value: false,
                            title: 'Hide in mobile',
                            key: 'hidden_mobile',
                            selector: 'tr',
                            _class: 'st-hide-mobile',
                          },
                          hiddenDesktop:
                          {
                            value: false,
                            title: 'Hide in desktop',
                            key: 'hidden_desktop',
                            selector: 'tr',
                            _class: 'st-hide-desktop',
                          },
                          resetPadding:
                          {
                            value: false,
                            title: 'Reset padding',
                            key: 'reset_padding',
                            selector: 'td:first',
                            _class: 'st-pd-0',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      hasCampaignSettings: true,
                    },
                    paletteBackgroundColor:
                    {
                      name: 'palette-background-color',
                      title: 'Palette Background color',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options:
                        {
                          bgcolor:
                          {
                            label: 'Background color',
                            key: 'bgcolor',
                            value: false,
                            palette: ['000000', '474646', '79A8C9', 'CD202C'],
                            defaultValue: 'transparent',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      hasCampaignSettings: true,
                      subComponent: 'button',
                    },
                    textOptions:
                    {
                      name: 'text-options',
                      title: 'Text Editable',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'text'],
                      config:
                      {
                        options:
                        {
                          undo:
                          {
                            label: 'Undo',
                            key: 'undo',
                            value: false,
                            icon: 'fa fa-undo',
                          },
                          redo:
                          {
                            label: 'Redo',
                            key: 'redo',
                            value: false,
                            icon: 'fa fa-repeat',
                          },
                          bold:
                          {
                            label: 'Bold',
                            key: 'bold',
                            value: false,
                            icon: 'fa fa-bold',
                          },
                          italic:
                          {
                            label: 'Italic',
                            key: 'italic',
                            value: false,
                            icon: 'fa fa-italic',
                          },
                          underline:
                          {
                            label: 'Underline',
                            key: 'underline',
                            value: false,
                            icon: 'fa fa-underline',
                          },
                          strikethrough:
                          {
                            label: 'Strikethrough',
                            key: 'strikethrough',
                            value: false,
                            icon: 'fa fa-strikethrough',
                          },
                          alignleft:
                          {
                            label: 'Align left',
                            key: 'alignleft',
                            value: false,
                            icon: 'fa fa-align-left',
                          },
                          aligncenter:
                          {
                            label: 'Align center',
                            key: 'aligncenter',
                            value: false,
                            icon: 'fa fa-align-center',
                          },
                          alignright:
                          {
                            label: 'Align right',
                            key: 'alignright',
                            value: false,
                            icon: 'fa fa-align-right',
                          },
                          superscript:
                          {
                            label: 'Superscript',
                            key: 'superscript',
                            value: false,
                            icon: 'fa fa-superscript',
                          },
                          fontselect:
                          {
                            label: 'Font',
                            key: 'fontselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-font',
                          },
                          fontsizeselect:
                          {
                            label: 'Font size',
                            key: 'fontsizeselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-text-size',
                          },
                          bullist:
                          {
                            label: 'Bullet list',
                            key: 'bullist',
                            value: false,
                            icon: 'fa fa-list-ul',
                          },
                          numlist:
                          {
                            label: 'Number list',
                            key: 'numlist',
                            value: false,
                            icon: 'fa fa-list-ol',
                          },
                          forecolor:
                          {
                            label: 'Font color',
                            key: 'forecolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-forecolor',
                            textcolor_map: ['000000', 'Black', '474646', 'Gray', '79a8c9', 'Blue', 'cd202c', 'Red'],
                            textcolor_from_library: false,
                            palette_name: '',
                          },
                          backcolor:
                          {
                            label: 'Background color',
                            key: 'backcolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-backcolor',
                          },
                          link:
                          {
                            label: 'Link',
                            key: 'link',
                            value: false,
                            icon: 'fa fa-link',
                          },
                          styleselect:
                          {
                            label: 'Style Format',
                            key: 'styleselect',
                            value: false,
                            icon: 'fa fa-edit',
                          },
                          stformatsmenu:
                          {
                            label: 'Custom Format',
                            key: 'stformatsmenu',
                            value: false,
                            icon: 'fa fa-edit',
                          },
                        },
                        settings:
                        {
                          link_validate_url:
                          {
                            title: 'Validate Url',
                            value: false,
                          },
                          truncate:
                          {
                            title: 'Characters Limit',
                            value: false,
                            type: 'number',
                          },
                          lines_limit:
                          {
                            title: 'Lines Limit',
                            value: false,
                            type: 'text',
                            content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                          },
                          fontsize_formats:
                          {
                            title: 'Font size',
                            value: false,
                            type: 'text',
                            content: '12px 14px 16px 18px',
                          },
                          style_formats:
                          {
                            title: 'Style format',
                            value: false,
                            type: 'text',
                            content: `[
                              {"title":"27px","block":"p","styles":{"fontSize":"27px","lineHeight":"30px"}},
                              {"title":"29px","block":"p","styles":{"fontSize":"29px","lineHeight":"32px"}},
                              {"title":"34px","block":"p","styles":{"fontSize":"34px","lineHeight":"36px"}}
                            ]`,
                          },
                          link_fixed_color:
                          {
                            title: 'Link fixed color',
                            value: false,
                            type: 'text',
                            dependsOn:
                            {
                              config: 'options',
                              name: 'link',
                            },
                          },
                          st_formats_menu:
                          {
                            title: 'Format menu',
                            value: false,
                            type: 'text',
                            content: `[
                              {"text":"Light","value":"light_font"},
                              {"text":"Normal","value":"normal_font"},
                              {"text":"Semi Bold","value":"semi_bold_font"},
                              {"text":"Bold","value":"bold_font"}
                            ]`,
                          },
                          formats:
                          {
                            title: 'Formats',
                            value: false,
                            type: 'text',
                            content: `{
                              "light_font":{"inline":"span","styles":{"fontWeight":"300"}},
                              "normal_font":{"inline":"span","styles":{"fontWeight":"400"}},
                              "semi_bold_font":{"inline":"span","styles":{"fontWeight":"600"}},
                              "bold_font":{"inline":"span","styles":{"fontWeight":"700"}}
                            }`,
                          },
                        },
                      },
                      render: false,
                      enabled: false,
                    },
                  },
                }],
              plugins:
              {
                columnBackgroundColor:
                {
                  name: 'column-background-color',
                  title: 'Background color',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    defaultValue: '#ffffff',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                  hasCampaignSettings: true,
                },
                columnPaletteBackgroundColor:
                {
                  name: 'column-palette-background-color',
                  title: 'Palette background color',
                  version: '0.0.1',
                  author: 'elias@stensul.com',
                  target: ['column'],
                  config:
                  {
                    usePaletteFromLibrary: false,
                    paletteName: '',
                    paletteMap: [],
                  },
                  data: [],
                  render: true,
                  enabled: false,
                  hasCampaignSettings: true,
                },
                verticalAlignment:
                {
                  name: 'vertical-alignment',
                  title: 'Vertical alignment',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    options: ['top', 'middle', 'bottom'],
                    defaultValue: 'middle',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                  hasCampaignSettings: true,
                },
                textColorByBackground:
                {
                  name: 'text-color-by-background',
                  title: 'Text Color by Background',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    lightText: '#FFFFFF',
                    darkText: '#000000',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                  hasCampaignSettings: true,
                },
              },
            }],
        },
        plugins:
        {
          moduleBackgroundColor:
          {
            name: 'module-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['module'],
            config:
            {
              defaultValue: '#ffffff',
            },
            data: [],
            render: true,
            enabled: false,
            hasCampaignSettings: true,
          },
          modulePaletteBackgroundColor:
          {
            name: 'module-palette-background-color',
            title: 'Palette Background color',
            version: '0.0.1',
            author: 'facundo.garcia@stensul.com',
            target: ['module'],
            config:
            {
              usePaletteFromLibrary: false,
              paletteName: '',
              paletteMap: [],
            },
            data: [],
            render: true,
            enabled: false,
            hasCampaignSettings: true,
          },
          toggleElement:
          {
            name: 'toggle-element',
            title: 'Toggle element',
            version: '0.0.1',
            author: 'facundo.garcia@stensul.com',
            target: ['module'],
            config:
            {
              defaultValue: false,
            },
            data: [],
            render: true,
            enabled: true,
            hasCampaignSettings: true,
          },
          textColorByBackgroundForModule:
          {
            name: 'text-color-by-background-for-module',
            title: 'Text Color by Background',
            version: '0.0.1',
            author: 'elias.torres@stensul.com',
            target: ['module'],
            config:
            {
              lightText: '#FFFFFF',
              darkText: '#000000',
            },
            data: [],
            render: true,
            enabled: false,
            hasCampaignSettings: true,
          },
        },
        status: 'publish',
        updated_at: '2018-09-13 17:34:40',
        created_at: '2018-09-13 17:34:40',
        isFixed: false,
        mandatory: false,
        data: [],
        idInstance: 923680,
      },
      {
        _id: '5b804dc7aa96550010596b62',
        type: 'studio',
        key: 'image_text',
        name: 'image_text',
        structure:
        {
          columnsStacking: 'normal',
          attribute:
          {
            bgcolor: '',
            classes: '',
          },
          mobileClasses: [],
          style:
          {
            paddingTop: '0px',
            paddingLeft: '0px',
            paddingBottom: '0px',
            paddingRight: '0px',
            borderTopWidth: '0px',
            borderTopStyle: 'none',
            borderTopColor: '',
            borderRightWidth: '0px',
            borderRightStyle: 'none',
            borderRightColor: '',
            borderBottomWidth: '0px',
            borderBottomStyle: 'none',
            borderBottomColor: '',
            borderLeftWidth: '0px',
            borderLeftStyle: 'none',
            borderLeftColor: '',
          },
          columns: [
            {
              id: 309588,
              type: 'column-element',
              container:
              {
                style:
                {
                  paddingTop: '0px',
                  paddingRight: '0px',
                  paddingBottom: '0px',
                  paddingLeft: '0px',
                },
                attribute:
                {
                  width: '50%',
                },
                styleOption:
                {
                  isPxWidth: false,
                },
              },
              content:
              {
                style: [],
                attribute: [],
                styleOption: [],
              },
              components: [
                {
                  id: 654565,
                  type: 'image-element',
                  container:
                  {
                    style:
                    {
                      paddingTop: '0px',
                      paddingRight: '0px',
                      paddingBottom: '0px',
                      paddingLeft: '0px',
                    },
                    styleOption: [],
                    attribute: [],
                  },
                  image:
                  {
                    attribute:
                    {
                      placeholder: 'campaigns/5bae3210a7082a001559ec93/en_us/5bb4e14717a4c-1538580807.0969.png',
                      href: '',
                      alt: 'Image',
                      title: 'Image',
                      width: '100%',
                      height: 'auto',
                    },
                    style: [],
                    styleOption:
                    {
                      hasImageMobile: false,
                      isBlockHeight: false,
                      isPxWidth: false,
                    },
                  },
                  plugins:
                  {
                    alignment:
                    {
                      name: 'alignment',
                      title: 'Alignment',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options: ['left', 'center', 'right'],
                        defaultValue: 'center',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'image',
                    },
                    backgroundColor:
                    {
                      name: 'background-color',
                      title: 'Background color',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        defaultColors: [
                          '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                          '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                        ],
                        defaultValue: '#ffffff',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    destinationUrl:
                    {
                      name: 'destination-url',
                      title: 'Destination Url',
                      version: '0.0.2',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'image'],
                      config:
                      {
                        options:
                        {
                          _blank: 'unchecked',
                          _self: 'expand',
                          _top: 'new-window',
                        },
                        defaultValue: '_blank',
                        validations:
                        {
                          required: false,
                          url: false,
                        },
                        target: false,
                      },
                      data: [],
                      render: true,
                      enabled: true,
                      validated: false,
                      subComponent: 'image',
                    },
                    mobileStyles:
                    {
                      name: 'mobile-styles',
                      title: 'Mobile styles',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['styles', 'button', 'divider', 'image', 'text'],
                      config:
                      {
                        settings:
                        {
                          hiddenMobile:
                          {
                            value: false,
                            title: 'Hide in mobile',
                            key: 'hidden_mobile',
                            selector: 'tr',
                            _class: 'st-hide-mobile',
                          },
                          hiddenDesktop:
                          {
                            value: false,
                            title: 'Hide in desktop',
                            key: 'hidden_desktop',
                            selector: 'tr',
                            _class: 'st-hide-desktop',
                          },
                          resetPadding:
                          {
                            value: false,
                            title: 'Reset padding',
                            key: 'reset_padding',
                            selector: 'td:first',
                            _class: 'st-pd-0',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                    },
                    paletteBackgroundColor:
                    {
                      name: 'palette-background-color',
                      title: 'Palette Background color',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options:
                        {
                          bgcolor:
                          {
                            label: 'Background color',
                            key: 'bgcolor',
                            value: false,
                            palette: ['000000', '474646', '79A8C9', 'CD202C'],
                            defaultValue: 'transparent',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    styleImageEditor:
                    {
                      name: 'style-image-editor',
                      title: 'style Image Editor',
                      version: '0.0.9',
                      author: 'ximena.garcia@stensul.com',
                      target: ['image'],
                      config:
                      {
                        library:
                        {
                          label: 'Media Gallery',
                          key: 'media_gallery',
                          type: 'switch',
                          value: false,
                          config:
                          {
                            set_images:
                            {
                              label: 'Image Set',
                              key: 'set_images',
                              value: null,
                              type: 'select',
                              options: [''],
                            },
                          },
                        },
                        url:
                        {
                          label: 'URL Upload',
                          key: 'url_upload',
                          value: false,
                          type: 'switch',
                        },
                        'sie-size':
                        {
                          label: 'Size',
                          key: 'size',
                          type: 'label',
                          value: true,
                          config:
                          {
                            size_width:
                            {
                              label: 'Width',
                              key: 'width',
                              value: 300,
                              type: 'number',
                              step: 1,
                            },
                            size_height:
                            {
                              label: 'Height',
                              key: 'height',
                              value: 200,
                              type: 'number',
                              step: 1,
                            },
                            size_auto:
                            {
                              label: 'Flexible height',
                              key: 'auto',
                              value: false,
                              type: 'switch',
                            },
                            size_minHeight:
                            {
                              label: 'Min. Height',
                              key: 'minHeight',
                              value: 100,
                              type: 'number',
                              step: 1,
                            },
                            size_maxHeight:
                            {
                              label: 'Max. Height',
                              key: 'maxHeight',
                              value: 1000,
                              type: 'number',
                              step: 1,
                            },
                            size_fit:
                            {
                              label: 'Image Fit',
                              key: 'fit',
                              value: '1',
                              type: 'select',
                              options: ['Contain', 'Cover', 'Max Size'],
                            },
                            size_minWidth:
                            {
                              label: 'Min. Width',
                              key: 'minWidth',
                              value: 1,
                              type: 'number',
                              step: 1,
                            },
                          },
                        },
                        smaller:
                        {
                          label: "Don't allow smaller images",
                          key: 'dontAllowSmaller',
                          value: false,
                          type: 'switch',
                        },
                        adjust:
                        {
                          label: 'Adjust campaign image size',
                          key: 'adjustImageSize',
                          value: false,
                          type: 'switch',
                        },
                        'sie-plugin-image_upload':
                        {
                          label: 'Upload',
                          key: 'upload',
                          type: 'label',
                          value: true,
                          config:
                          {
                            uploaddefault:
                            {
                              label: 'Default image',
                              key: 'url',
                              value: '',
                              type: 'text',
                            },
                            fillcolor:
                            {
                              label: 'Background color',
                              key: 'fillColor',
                              value: '#000000',
                              type: 'text',
                            },
                          },
                        },
                        'sie-plugin-image_cropper':
                        {
                          label: 'Cropper',
                          key: 'enable',
                          type: 'switch',
                          value: true,
                          config:
                          {
                            movable:
                            {
                              label: 'Enable Drag',
                              key: 'movable',
                              value: true,
                              type: 'switch',
                            },
                            rotatable:
                            {
                              label: 'Enable rotation',
                              key: 'rotatable',
                              value: false,
                              type: 'switch',
                            },
                            zoomable:
                            {
                              label: 'Enable zoom',
                              key: 'zoomable',
                              value: true,
                              type: 'switch',
                            },
                            vertical:
                            {
                              label: 'Vertical crop',
                              key: 'cropBoxResizable',
                              value: false,
                              type: 'switch',
                            },
                            round:
                            {
                              label: 'Circle Cropping',
                              key: 'cropper_roundCrop',
                              value: false,
                              type: 'switch',
                              config:
                              {
                                only:
                                {
                                  label: 'Only circle cropping',
                                  key: 'only',
                                  value: false,
                                  type: 'switch',
                                },
                                circle_diameter:
                                {
                                  label: 'Diameter',
                                  key: 'diameter',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                              },
                            },
                          },
                        },
                        'sie-plugin-text_text':
                        {
                          label: 'Text',
                          key: 'text',
                          value: false,
                          type: 'switch',
                          config:
                          {
                            text_visible:
                            {
                              label: 'Visible',
                              key: 'visible',
                              value: true,
                              type: 'switch',
                            },
                            text_default:
                            {
                              label: 'Default text',
                              key: 'default',
                              value: 'Lorem ipsum sit dolom',
                              type: 'text',
                            },
                            text_description:
                            {
                              label: 'Description',
                              key: 'description',
                              value: 'Text',
                              type: 'text',
                            },
                            text_top:
                            {
                              label: 'Top',
                              key: 'top',
                              value: 0,
                              type: 'number',
                              step: 1,
                            },
                            text_left:
                            {
                              label: 'Left',
                              key: 'left',
                              value: 0,
                              type: 'number',
                              step: 1,
                            },
                          },
                        },
                        'sie-plugin-image-overlay_image':
                        {
                          label: 'Image Overlay',
                          key: 'image',
                          value: false,
                          type: 'switch',
                          config:
                          {
                            overlay_visible:
                            {
                              label: 'Visible',
                              key: 'visible',
                              value: true,
                              type: 'switch',
                            },
                            overlay_default:
                            {
                              label: 'Default image',
                              key: 'url',
                              value: '',
                              type: 'text',
                            },
                            overlay_change:
                            {
                              label: 'Change Image',
                              key: 'changable',
                              value: true,
                              type: 'switch',
                            },
                            overlay_width:
                            {
                              label: 'Width',
                              key: 'width',
                              value: 100,
                              type: 'number',
                              step: 1,
                            },
                            overlay_height:
                            {
                              label: 'Height',
                              key: 'height',
                              value: 100,
                              type: 'number',
                              step: 1,
                            },
                            overlay_resizable:
                            {
                              label: 'Fixed Size',
                              key: 'resizable',
                              value: false,
                              type: 'switch',
                            },
                            overlay_absolute:
                            {
                              label: 'Absolute position',
                              key: 'position_absolute',
                              value: true,
                              type: 'switch',
                              config:
                              {
                                overlay_top:
                                {
                                  label: 'Top',
                                  key: 'top',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_left:
                                {
                                  label: 'Left',
                                  key: 'left',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                              },
                            },
                            overlay_relative:
                            {
                              label: 'Relative position',
                              key: 'position_relative',
                              value: false,
                              type: 'switch',
                              config:
                              {
                                overlay_alignx:
                                {
                                  label: 'Horizontal Alignment',
                                  key: 'alignx',
                                  value: '0',
                                  type: 'select',
                                  options: ['Left', 'Center', 'Right'],
                                },
                                overlay_aligny:
                                {
                                  label: 'Vertical Alignment',
                                  key: 'aligny',
                                  value: '0',
                                  type: 'select',
                                  options: ['Top', 'Center', 'Bottom'],
                                },
                              },
                            },
                            overlay_fixed:
                            {
                              label: 'Fixed Position',
                              key: 'fixed',
                              value: false,
                              type: 'switch',
                            },
                            overlay_description:
                            {
                              label: 'Description',
                              key: 'description',
                              value: 'Text',
                              type: 'text',
                            },
                          },
                        },
                        'sie-plugin-shapemask_options':
                        {
                          label: 'Shapemask',
                          key: 'shapemask',
                          value: false,
                          type: 'switch',
                          config:
                          {
                            shapemask_visible:
                            {
                              label: 'Visible',
                              key: 'visible',
                              value: false,
                              type: 'switch',
                            },
                            transparencycolor:
                            {
                              label: 'Fill color',
                              key: 'transparencyColor',
                              value: '#000000',
                              type: 'text',
                            },
                            transparency:
                            {
                              label: 'Transparency',
                              key: 'transparency',
                              value: 1,
                              max: 1,
                              min: 0,
                              step: 0.1,
                              type: 'number',
                            },
                            shapemask_square:
                            {
                              label: 'Square',
                              key: 'shapes_square',
                              type: 'switch',
                              value: false,
                              config:
                              {
                                square_width:
                                {
                                  label: 'Width',
                                  key: 'width',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                square_height:
                                {
                                  label: 'Height',
                                  key: 'height',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                square_top:
                                {
                                  label: 'Top',
                                  key: 'top',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                square_left:
                                {
                                  label: 'Left',
                                  key: 'left',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                square_description:
                                {
                                  label: 'Description',
                                  key: 'description',
                                  type: 'text',
                                  value: 'Square',
                                },
                                square_icon:
                                {
                                  label: 'Icon',
                                  key: 'icon',
                                  type: 'text',
                                  value: 'fa fa-square-o',
                                },
                              },
                            },
                            shapemask_circle:
                            {
                              label: 'Circle',
                              key: 'shapes_circle',
                              type: 'switch',
                              value: false,
                              config:
                              {
                                circle_radius:
                                {
                                  label: 'Radius',
                                  key: 'radius',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                circle_top:
                                {
                                  label: 'Top',
                                  key: 'top',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                circle_left:
                                {
                                  label: 'Left',
                                  key: 'left',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                circle_description:
                                {
                                  label: 'Description',
                                  key: 'description',
                                  type: 'text',
                                  value: 'Circle',
                                },
                                circle_icon:
                                {
                                  label: 'Icon',
                                  key: 'icon',
                                  type: 'text',
                                  value: 'fa fa-circle-o',
                                },
                              },
                            },
                          },
                        },
                      },
                      data:
                      {
                        img: 'campaigns/5bae3210a7082a001559ec93/en_us/5bb4e14717a4c-1538580807.0969.png',
                        state:
                        {
                          size:
                          {
                            width: 300,
                            height: 200,
                            auto: false,
                            minHeight: 100,
                            maxHeight: 1000,
                            fit: '1',
                            minWidth: 1,
                            scale: 1.6666666666666667,
                          },
                          outputSize:
                          {
                            height: 200,
                            width: 300,
                            top: 0,
                            left: 0,
                            auto: false,
                            minHeight: 100,
                            maxHeight: 1000,
                            fit: '1',
                            minWidth: 1,
                          },
                          preset: [
                            {
                              type: 'sie-plugin-image',
                              options:
                              {
                                plugin:
                                {
                                  cropper:
                                  {
                                    cropBoxResizable: false,
                                    movable: true,
                                    scalable: true,
                                    rotatable: false,
                                    zoomable: true,
                                    zoomOnTouch: false,
                                    zoomOnWheel: true,
                                    enable: true,
                                    roundCrop:
                                    {
                                      enable: false,
                                    },
                                    viewMode: 3,
                                    dragMode: 'move',
                                    modal: true,
                                    guides: false,
                                    center: false,
                                    highlight: false,
                                    background: false,
                                    autoCropArea: 1,
                                    toggleDragModeOnDblclick: false,
                                    cropBoxMovable: false,
                                    minContainerWidth: 1,
                                    minContainerHeight: 1,
                                    minCanvasWidth: 1,
                                    minCanvasHeight: 1,
                                    minCropBoxWidth: 1,
                                    minCropBoxHeight: 100,
                                    restore: false,
                                    state:
                                    {
                                      data:
                                      {
                                        x: 0,
                                        y: 83,
                                        width: 500,
                                        height: 334,
                                        scaleX: 1,
                                        scaleY: 1,
                                      },
                                      canvas:
                                      {
                                        left: 0,
                                        top: -50,
                                        width: 300,
                                        height: 300,
                                        naturalWidth: 500,
                                        naturalHeight: 500,
                                      },
                                      cropbox:
                                      {
                                        left: 0,
                                        top: 0,
                                        width: 300,
                                        height: 200,
                                      },
                                      roundCrop:
                                      {
                                        round:
                                        {
                                          enable: false,
                                          only: false,
                                          diameter: 300,
                                        },
                                        active: false,
                                      },
                                    },
                                  },
                                  upload:
                                  {
                                    url: 'campaigns/5bae3210a7082a001559ec93/en_us/5bb4e14716c32-1538580807.0933.jpg',
                                    fillColor: '#000000',
                                    gif: false,
                                  },
                                },
                                layer:
                                {
                                  description: '',
                                  visible: true,
                                },
                              },
                            }],
                        },
                      },
                      enabled: true,
                      settings: true,
                    },
                  },
                  data: [],
                }],
              plugins:
              {
                columnBackgroundColor:
                {
                  name: 'column-background-color',
                  title: 'Background color',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    defaultColors: [
                      '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                      '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                    ],
                    defaultValue: '#ffffff',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                verticalAlignment:
                {
                  name: 'vertical-alignment',
                  title: 'Vertical alignment',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    options: ['top', 'middle', 'bottom'],
                    defaultValue: 'middle',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                textColorByBackground:
                {
                  name: 'text-color-by-background',
                  title: 'Text Color by Background',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    lightText: '#FFFFFF',
                    darkText: '#000000',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
              },
            },
            {
              id: 796173,
              type: 'column-element',
              container:
              {
                style:
                {
                  paddingTop: '0px',
                  paddingRight: '0px',
                  paddingBottom: '0px',
                  paddingLeft: '0px',
                },
                attribute:
                {
                  width: '50%',
                },
                styleOption:
                {
                  isPxWidth: false,
                },
              },
              content:
              {
                style: [],
                attribute: [],
                styleOption: [],
              },
              components: [
                {
                  id: 218801,
                  type: 'text-element',
                  data:
                  {
                    text: `<p style="margin: 0px;">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                       eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>`,
                  },
                  container:
                  {
                    style:
                    {
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                    },
                    styleOption: [],
                    attribute: [],
                  },
                  text:
                  {
                    style:
                    {
                      fontFamily: 'Helvetica, Arial, Sans-serif',
                      fontSize: '12px',
                      color: '#000000',
                      fontWeight: 'normal',
                      lineHeight: '16px',
                      align: 'left',
                      letterSpacing: 'normal',
                    },
                    styleOption:
                    {
                      isNormalLetterSpacing: true,
                      isCustomFontWeight: false,
                    },
                    attribute: [],
                  },
                  plugins:
                  {
                    alignment:
                    {
                      name: 'alignment',
                      title: 'Alignment',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options: ['left', 'center', 'right'],
                        defaultValue: 'center',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'text',
                    },
                    backgroundColor:
                    {
                      name: 'background-color',
                      title: 'Background color',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        defaultColors: [
                          '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                          '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                        ],
                        defaultValue: '#ffffff',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    mobileStyles:
                    {
                      name: 'mobile-styles',
                      title: 'Mobile styles',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['styles', 'button', 'divider', 'image', 'text'],
                      config:
                      {
                        settings:
                        {
                          hiddenMobile:
                          {
                            value: false,
                            title: 'Hide in mobile',
                            key: 'hidden_mobile',
                            selector: 'tr',
                            _class: 'st-hide-mobile',
                          },
                          hiddenDesktop:
                          {
                            value: false,
                            title: 'Hide in desktop',
                            key: 'hidden_desktop',
                            selector: 'tr',
                            _class: 'st-hide-desktop',
                          },
                          resetPadding:
                          {
                            value: false,
                            title: 'Reset padding',
                            key: 'reset_padding',
                            selector: 'td:first',
                            _class: 'st-pd-0',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                    },
                    paletteBackgroundColor:
                    {
                      name: 'palette-background-color',
                      title: 'Palette Background color',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options:
                        {
                          bgcolor:
                          {
                            label: 'Background color',
                            key: 'bgcolor',
                            value: false,
                            palette: ['000000', '474646', '79A8C9', 'CD202C'],
                            defaultValue: 'transparent',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    textOptions:
                    {
                      name: 'text-options',
                      title: 'Text Editable',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'text'],
                      config:
                      {
                        options:
                        {
                          undo:
                          {
                            label: 'Undo',
                            key: 'undo',
                            value: false,
                            icon: 'fa fa-undo',
                          },
                          redo:
                          {
                            label: 'Redo',
                            key: 'redo',
                            value: false,
                            icon: 'fa fa-repeat',
                          },
                          bold:
                          {
                            label: 'Bold',
                            key: 'bold',
                            value: true,
                            icon: 'fa fa-bold',
                          },
                          italic:
                          {
                            label: 'Italic',
                            key: 'italic',
                            value: true,
                            icon: 'fa fa-italic',
                          },
                          underline:
                          {
                            label: 'Underline',
                            key: 'underline',
                            value: true,
                            icon: 'fa fa-underline',
                          },
                          strikethrough:
                          {
                            label: 'Strikethrough',
                            key: 'strikethrough',
                            value: false,
                            icon: 'fa fa-strikethrough',
                          },
                          alignleft:
                          {
                            label: 'Align left',
                            key: 'alignleft',
                            value: true,
                            icon: 'fa fa-align-left',
                          },
                          aligncenter:
                          {
                            label: 'Align center',
                            key: 'aligncenter',
                            value: true,
                            icon: 'fa fa-align-center',
                          },
                          alignright:
                          {
                            label: 'Align right',
                            key: 'alignright',
                            value: true,
                            icon: 'fa fa-align-right',
                          },
                          superscript:
                          {
                            label: 'Superscript',
                            key: 'superscript',
                            value: false,
                            icon: 'fa fa-superscript',
                          },
                          fontselect:
                          {
                            label: 'Font',
                            key: 'fontselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-font',
                          },
                          fontsizeselect:
                          {
                            label: 'Font size',
                            key: 'fontsizeselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-text-size',
                          },
                          bullist:
                          {
                            label: 'Bullet list',
                            key: 'bullist',
                            value: true,
                            icon: 'fa fa-list-ul',
                          },
                          numlist:
                          {
                            label: 'Number list',
                            key: 'numlist',
                            value: true,
                            icon: 'fa fa-list-ol',
                          },
                          forecolor:
                          {
                            label: 'Font color',
                            key: 'forecolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-forecolor',
                            textcolor_map: ['000000', 'Black', '474646', 'Gray', '79a8c9', 'Blue', 'cd202c', 'Red'],
                            textcolor_from_library: false,
                            palette_name: '',
                          },
                          backcolor:
                          {
                            label: 'Background color',
                            key: 'backcolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-backcolor',
                          },
                          link:
                          {
                            label: 'Link',
                            key: 'link',
                            value: true,
                            icon: 'fa fa-link',
                          },
                          styleselect:
                          {
                            label: 'Style Format',
                            key: 'styleselect',
                            value: false,
                            icon: 'fa fa-edit',
                          },
                        },
                        settings:
                        {
                          link_validate_url:
                          {
                            title: 'Validate Url',
                            value: true,
                          },
                          truncate:
                          {
                            title: 'Characters Limit',
                            value: true,
                            type: 'number',
                            content: 200,
                          },
                          lines_limit:
                          {
                            title: 'Lines Limit',
                            value: false,
                            type: 'text',
                            content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                          },
                          fontsize_formats:
                          {
                            title: 'Font size',
                            value: false,
                            type: 'text',
                            content: '12px 14px 16px 18px',
                          },
                          style_formats:
                          {
                            title: 'Style format',
                            value: false,
                            type: 'text',
                            content: `[
                              {"title":"27px","block":"p","styles":{"fontSize":"27px","lineHeight":"30px"}},
                              {"title":"29px","block":"p","styles":{"fontSize":"29px","lineHeight":"32px"}},
                              {"title":"34px","block":"p","styles":{"fontSize":"34px","lineHeight":"36px"}}
                            ]`,
                          },
                          link_fixed_color:
                          {
                            title: 'Link fixed color',
                            value: false,
                            type: 'text',
                            dependsOn:
                            {
                              config: 'options',
                              name: 'link',
                            },
                          },
                        },
                      },
                      render: false,
                      enabled: true,
                    },
                  },
                }],
              plugins:
              {
                columnBackgroundColor:
                {
                  name: 'column-background-color',
                  title: 'Background color',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    defaultColors: [
                      '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                      '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                    ],
                    defaultValue: '#ffffff',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                verticalAlignment:
                {
                  name: 'vertical-alignment',
                  title: 'Vertical alignment',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    options: ['top', 'middle', 'bottom'],
                    defaultValue: 'middle',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                textColorByBackground:
                {
                  name: 'text-color-by-background',
                  title: 'Text Color by Background',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    lightText: '#FFFFFF',
                    darkText: '#000000',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
              },
            }],
        },
        plugins:
        {
          moduleBackgroundColor:
          {
            name: 'module-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['module'],
            config:
            {
              defaultColors: [
                '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
              ],
              defaultValue: '#ffffff',
            },
            data: [],
            render: true,
            enabled: false,
          },
          textColorByBackgroundForModule:
          {
            name: 'text-color-by-background-for-module',
            title: 'Text Color by Background',
            version: '0.0.1',
            author: 'elias.torres@stensul.com',
            target: ['module'],
            config:
            {
              lightText: '#FFFFFF',
              darkText: '#000000',
            },
            data: [],
            render: true,
            enabled: false,
          },
        },
        status: 'publish',
        updated_at: '2018-08-24 15:13:05',
        created_at: '2018-08-24 14:26:15',
        isFixed: false,
        mandatory: false,
        data: [],
        idInstance: 425265,
      },
      {
        _id: '5b8051b2aa96550018023593',
        type: 'virtual',
        key: 'fixed',
        name: 'fixed',
        structure:
        {
          columnsStacking: 'normal',
          attribute:
          {
            bgcolor: '',
            classes: '',
          },
          mobileClasses: [],
          style:
          {
            paddingTop: '0px',
            paddingLeft: '0px',
            paddingBottom: '0px',
            paddingRight: '0px',
            borderTopWidth: '0px',
            borderTopStyle: 'none',
            borderTopColor: '',
            borderRightWidth: '0px',
            borderRightStyle: 'none',
            borderRightColor: '',
            borderBottomWidth: '0px',
            borderBottomStyle: 'none',
            borderBottomColor: '',
            borderLeftWidth: '0px',
            borderLeftStyle: 'none',
            borderLeftColor: '',
          },
          columns: [
            {
              id: 125826,
              type: 'column-element',
              container:
              {
                style:
                {
                  paddingTop: '0px',
                  paddingRight: '0px',
                  paddingBottom: '0px',
                  paddingLeft: '0px',
                },
                attribute:
                {
                  width: '33.333333333333336%',
                },
                styleOption:
                {
                  isPxWidth: false,
                },
              },
              content:
              {
                style: [],
                attribute: [],
                styleOption: [],
              },
              components: [
                {
                  id: 103023,
                  type: 'text-element',
                  data:
                  {
                    text: `<p style="margin: 0px;">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod 
                      tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
                      At vero eos et accusam et justo duo dolores et ea rebum.</p>`,
                  },
                  container:
                  {
                    style:
                    {
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                    },
                    styleOption: [],
                    attribute: [],
                  },
                  text:
                  {
                    style:
                    {
                      fontFamily: 'Helvetica, Arial, Sans-serif',
                      fontSize: '12px',
                      color: '#000000',
                      fontWeight: 'normal',
                      lineHeight: '16px',
                      align: 'left',
                      letterSpacing: 'normal',
                    },
                    styleOption:
                    {
                      isNormalLetterSpacing: true,
                      isCustomFontWeight: false,
                    },
                    attribute: [],
                  },
                  plugins:
                  {
                    alignment:
                    {
                      name: 'alignment',
                      title: 'Alignment',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options: ['left', 'center', 'right'],
                        defaultValue: 'center',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'text',
                    },
                    backgroundColor:
                    {
                      name: 'background-color',
                      title: 'Background color',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        defaultColors: [
                          '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                          '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                        ],
                        defaultValue: '#ffffff',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    mobileStyles:
                    {
                      name: 'mobile-styles',
                      title: 'Mobile styles',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['styles', 'button', 'divider', 'image', 'text'],
                      config:
                      {
                        settings:
                        {
                          hiddenMobile:
                          {
                            value: false,
                            title: 'Hide in mobile',
                            key: 'hidden_mobile',
                            selector: 'tr',
                            _class: 'st-hide-mobile',
                          },
                          hiddenDesktop:
                          {
                            value: false,
                            title: 'Hide in desktop',
                            key: 'hidden_desktop',
                            selector: 'tr',
                            _class: 'st-hide-desktop',
                          },
                          resetPadding:
                          {
                            value: false,
                            title: 'Reset padding',
                            key: 'reset_padding',
                            selector: 'td:first',
                            _class: 'st-pd-0',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                    },
                    paletteBackgroundColor:
                    {
                      name: 'palette-background-color',
                      title: 'Palette Background color',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options:
                        {
                          bgcolor:
                          {
                            label: 'Background color',
                            key: 'bgcolor',
                            value: false,
                            palette: ['000000', '474646', '79A8C9', 'CD202C'],
                            defaultValue: 'transparent',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    textOptions:
                    {
                      name: 'text-options',
                      title: 'Text Editable',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'text'],
                      config:
                      {
                        options:
                        {
                          undo:
                          {
                            label: 'Undo',
                            key: 'undo',
                            value: false,
                            icon: 'fa fa-undo',
                          },
                          redo:
                          {
                            label: 'Redo',
                            key: 'redo',
                            value: false,
                            icon: 'fa fa-repeat',
                          },
                          bold:
                          {
                            label: 'Bold',
                            key: 'bold',
                            value: true,
                            icon: 'fa fa-bold',
                          },
                          italic:
                          {
                            label: 'Italic',
                            key: 'italic',
                            value: true,
                            icon: 'fa fa-italic',
                          },
                          underline:
                          {
                            label: 'Underline',
                            key: 'underline',
                            value: true,
                            icon: 'fa fa-underline',
                          },
                          strikethrough:
                          {
                            label: 'Strikethrough',
                            key: 'strikethrough',
                            value: false,
                            icon: 'fa fa-strikethrough',
                          },
                          alignleft:
                          {
                            label: 'Align left',
                            key: 'alignleft',
                            value: false,
                            icon: 'fa fa-align-left',
                          },
                          aligncenter:
                          {
                            label: 'Align center',
                            key: 'aligncenter',
                            value: false,
                            icon: 'fa fa-align-center',
                          },
                          alignright:
                          {
                            label: 'Align right',
                            key: 'alignright',
                            value: false,
                            icon: 'fa fa-align-right',
                          },
                          superscript:
                          {
                            label: 'Superscript',
                            key: 'superscript',
                            value: false,
                            icon: 'fa fa-superscript',
                          },
                          fontselect:
                          {
                            label: 'Font',
                            key: 'fontselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-font',
                          },
                          fontsizeselect:
                          {
                            label: 'Font size',
                            key: 'fontsizeselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-text-size',
                          },
                          bullist:
                          {
                            label: 'Bullet list',
                            key: 'bullist',
                            value: false,
                            icon: 'fa fa-list-ul',
                          },
                          numlist:
                          {
                            label: 'Number list',
                            key: 'numlist',
                            value: false,
                            icon: 'fa fa-list-ol',
                          },
                          forecolor:
                          {
                            label: 'Font color',
                            key: 'forecolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-forecolor',
                            textcolor_map: ['000000', 'Black', '474646', 'Gray', '79a8c9', 'Blue', 'cd202c', 'Red'],
                            textcolor_from_library: false,
                            palette_name: '',
                          },
                          backcolor:
                          {
                            label: 'Background color',
                            key: 'backcolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-backcolor',
                          },
                          link:
                          {
                            label: 'Link',
                            key: 'link',
                            value: false,
                            icon: 'fa fa-link',
                          },
                          styleselect:
                          {
                            label: 'Style Format',
                            key: 'styleselect',
                            value: false,
                            icon: 'fa fa-edit',
                          },
                        },
                        settings:
                        {
                          link_validate_url:
                          {
                            title: 'Validate Url',
                            value: false,
                          },
                          truncate:
                          {
                            title: 'Characters Limit',
                            value: false,
                            type: 'number',
                          },
                          lines_limit:
                          {
                            title: 'Lines Limit',
                            value: false,
                            type: 'text',
                            content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                          },
                          fontsize_formats:
                          {
                            title: 'Font size',
                            value: false,
                            type: 'text',
                            content: '12px 14px 16px 18px',
                          },
                          style_formats:
                          {
                            title: 'Style format',
                            value: false,
                            type: 'text',
                            content: `[
                              {"title":"27px","block":"p","styles":{"fontSize":"27px","lineHeight":"30px"}},
                              {"title":"29px","block":"p","styles":{"fontSize":"29px","lineHeight":"32px"}},
                              {"title":"34px","block":"p","styles":{"fontSize":"34px","lineHeight":"36px"}}
                            ]`,
                          },
                          link_fixed_color:
                          {
                            title: 'Link fixed color',
                            value: false,
                            type: 'text',
                            dependsOn:
                            {
                              config: 'options',
                              name: 'link',
                            },
                          },
                        },
                      },
                      render: false,
                      enabled: true,
                    },
                  },
                }],
              plugins:
              {
                columnBackgroundColor:
                {
                  name: 'column-background-color',
                  title: 'Background color',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    defaultColors: [
                      '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                      '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                    ],
                    defaultValue: '#ffffff',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                verticalAlignment:
                {
                  name: 'vertical-alignment',
                  title: 'Vertical alignment',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    options: ['top', 'middle', 'bottom'],
                    defaultValue: 'middle',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                textColorByBackground:
                {
                  name: 'text-color-by-background',
                  title: 'Text Color by Background',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    lightText: '#FFFFFF',
                    darkText: '#000000',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
              },
            },
            {
              id: 518404,
              type: 'column-element',
              container:
              {
                style:
                {
                  paddingTop: '0px',
                  paddingRight: '0px',
                  paddingBottom: '0px',
                  paddingLeft: '0px',
                },
                attribute:
                {
                  width: '33.333333333333336%',
                },
                styleOption:
                {
                  isPxWidth: false,
                },
              },
              content:
              {
                style: [],
                attribute: [],
                styleOption: [],
              },
              components: [
                {
                  id: 731753,
                  type: 'text-element',
                  data:
                  {
                    text: `<p style="margin: 0px;">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                      labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et 
                      accusam et justo duo dolores et ea rebum.</p>`,
                  },
                  container:
                  {
                    style:
                    {
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                    },
                    styleOption: [],
                    attribute: [],
                  },
                  text:
                  {
                    style:
                    {
                      fontFamily: 'Helvetica, Arial, Sans-serif',
                      fontSize: '12px',
                      color: '#000000',
                      fontWeight: 'normal',
                      lineHeight: '16px',
                      align: 'left',
                      letterSpacing: 'normal',
                    },
                    styleOption:
                    {
                      isNormalLetterSpacing: true,
                      isCustomFontWeight: false,
                    },
                    attribute: [],
                  },
                  plugins:
                  {
                    alignment:
                    {
                      name: 'alignment',
                      title: 'Alignment',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options: ['left', 'center', 'right'],
                        defaultValue: 'center',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'text',
                    },
                    backgroundColor:
                    {
                      name: 'background-color',
                      title: 'Background color',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        defaultColors: [
                          '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                          '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                        ],
                        defaultValue: '#ffffff',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    mobileStyles:
                    {
                      name: 'mobile-styles',
                      title: 'Mobile styles',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['styles', 'button', 'divider', 'image', 'text'],
                      config:
                      {
                        settings:
                        {
                          hiddenMobile:
                          {
                            value: false,
                            title: 'Hide in mobile',
                            key: 'hidden_mobile',
                            selector: 'tr',
                            _class: 'st-hide-mobile',
                          },
                          hiddenDesktop:
                          {
                            value: false,
                            title: 'Hide in desktop',
                            key: 'hidden_desktop',
                            selector: 'tr',
                            _class: 'st-hide-desktop',
                          },
                          resetPadding:
                          {
                            value: false,
                            title: 'Reset padding',
                            key: 'reset_padding',
                            selector: 'td:first',
                            _class: 'st-pd-0',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                    },
                    paletteBackgroundColor:
                    {
                      name: 'palette-background-color',
                      title: 'Palette Background color',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options:
                        {
                          bgcolor:
                          {
                            label: 'Background color',
                            key: 'bgcolor',
                            value: false,
                            palette: ['000000', '474646', '79A8C9', 'CD202C'],
                            defaultValue: 'transparent',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    textOptions:
                    {
                      name: 'text-options',
                      title: 'Text Editable',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'text'],
                      config:
                      {
                        options:
                        {
                          undo:
                          {
                            label: 'Undo',
                            key: 'undo',
                            value: false,
                            icon: 'fa fa-undo',
                          },
                          redo:
                          {
                            label: 'Redo',
                            key: 'redo',
                            value: false,
                            icon: 'fa fa-repeat',
                          },
                          bold:
                          {
                            label: 'Bold',
                            key: 'bold',
                            value: true,
                            icon: 'fa fa-bold',
                          },
                          italic:
                          {
                            label: 'Italic',
                            key: 'italic',
                            value: true,
                            icon: 'fa fa-italic',
                          },
                          underline:
                          {
                            label: 'Underline',
                            key: 'underline',
                            value: true,
                            icon: 'fa fa-underline',
                          },
                          strikethrough:
                          {
                            label: 'Strikethrough',
                            key: 'strikethrough',
                            value: false,
                            icon: 'fa fa-strikethrough',
                          },
                          alignleft:
                          {
                            label: 'Align left',
                            key: 'alignleft',
                            value: false,
                            icon: 'fa fa-align-left',
                          },
                          aligncenter:
                          {
                            label: 'Align center',
                            key: 'aligncenter',
                            value: false,
                            icon: 'fa fa-align-center',
                          },
                          alignright:
                          {
                            label: 'Align right',
                            key: 'alignright',
                            value: false,
                            icon: 'fa fa-align-right',
                          },
                          superscript:
                          {
                            label: 'Superscript',
                            key: 'superscript',
                            value: false,
                            icon: 'fa fa-superscript',
                          },
                          fontselect:
                          {
                            label: 'Font',
                            key: 'fontselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-font',
                          },
                          fontsizeselect:
                          {
                            label: 'Font size',
                            key: 'fontsizeselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-text-size',
                          },
                          bullist:
                          {
                            label: 'Bullet list',
                            key: 'bullist',
                            value: false,
                            icon: 'fa fa-list-ul',
                          },
                          numlist:
                          {
                            label: 'Number list',
                            key: 'numlist',
                            value: false,
                            icon: 'fa fa-list-ol',
                          },
                          forecolor:
                          {
                            label: 'Font color',
                            key: 'forecolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-forecolor',
                            textcolor_map: ['000000', 'Black', '474646', 'Gray', '79a8c9', 'Blue', 'cd202c', 'Red'],
                            textcolor_from_library: false,
                            palette_name: '',
                          },
                          backcolor:
                          {
                            label: 'Background color',
                            key: 'backcolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-backcolor',
                          },
                          link:
                          {
                            label: 'Link',
                            key: 'link',
                            value: false,
                            icon: 'fa fa-link',
                          },
                          styleselect:
                          {
                            label: 'Style Format',
                            key: 'styleselect',
                            value: false,
                            icon: 'fa fa-edit',
                          },
                        },
                        settings:
                        {
                          link_validate_url:
                          {
                            title: 'Validate Url',
                            value: false,
                          },
                          truncate:
                          {
                            title: 'Characters Limit',
                            value: false,
                            type: 'number',
                          },
                          lines_limit:
                          {
                            title: 'Lines Limit',
                            value: false,
                            type: 'text',
                            content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                          },
                          fontsize_formats:
                          {
                            title: 'Font size',
                            value: false,
                            type: 'text',
                            content: '12px 14px 16px 18px',
                          },
                          style_formats:
                          {
                            title: 'Style format',
                            value: false,
                            type: 'text',
                            content: `[
                              {"title":"27px","block":"p","styles":{"fontSize":"27px","lineHeight":"30px"}},
                              {"title":"29px","block":"p","styles":{"fontSize":"29px","lineHeight":"32px"}},
                              {"title":"34px","block":"p","styles":{"fontSize":"34px","lineHeight":"36px"}}
                            ]`,
                          },
                          link_fixed_color:
                          {
                            title: 'Link fixed color',
                            value: false,
                            type: 'text',
                            dependsOn:
                            {
                              config: 'options',
                              name: 'link',
                            },
                          },
                        },
                      },
                      render: false,
                      enabled: true,
                    },
                  },
                }],
              plugins:
              {
                columnBackgroundColor:
                {
                  name: 'column-background-color',
                  title: 'Background color',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    defaultColors: [
                      '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                      '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                    ],
                    defaultValue: '#ffffff',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                verticalAlignment:
                {
                  name: 'vertical-alignment',
                  title: 'Vertical alignment',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    options: ['top', 'middle', 'bottom'],
                    defaultValue: 'middle',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                textColorByBackground:
                {
                  name: 'text-color-by-background',
                  title: 'Text Color by Background',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    lightText: '#FFFFFF',
                    darkText: '#000000',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
              },
            },
            {
              id: 108268,
              type: 'column-element',
              container:
              {
                style:
                {
                  paddingTop: '0px',
                  paddingRight: '0px',
                  paddingBottom: '0px',
                  paddingLeft: '0px',
                },
                attribute:
                {
                  width: '33.333333333333336%',
                },
                styleOption:
                {
                  isPxWidth: false,
                },
              },
              content:
              {
                style: [],
                attribute: [],
                styleOption: [],
              },
              components: [
                {
                  id: 938609,
                  type: 'text-element',
                  data:
                  {
                    text: `<p>
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor 
                      invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
                      At vero eos et accusam et justo duo dolores et ea rebum.</p>`,
                  },
                  container:
                  {
                    style:
                    {
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                    },
                    styleOption: [],
                    attribute: [],
                  },
                  text:
                  {
                    style:
                    {
                      fontFamily: 'Helvetica, Arial, Sans-serif',
                      fontSize: '12px',
                      color: '#000000',
                      fontWeight: 'normal',
                      lineHeight: '16px',
                      align: 'left',
                      letterSpacing: 'normal',
                    },
                    styleOption:
                    {
                      isNormalLetterSpacing: true,
                      isCustomFontWeight: false,
                    },
                    attribute: [],
                  },
                  plugins:
                  {
                    alignment:
                    {
                      name: 'alignment',
                      title: 'Alignment',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options: ['left', 'center', 'right'],
                        defaultValue: 'center',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'text',
                    },
                    backgroundColor:
                    {
                      name: 'background-color',
                      title: 'Background color',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        defaultColors: [
                          '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                          '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                        ],
                        defaultValue: '#ffffff',
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    mobileStyles:
                    {
                      name: 'mobile-styles',
                      title: 'Mobile styles',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['styles', 'button', 'divider', 'image', 'text'],
                      config:
                      {
                        settings:
                        {
                          hiddenMobile:
                          {
                            value: false,
                            title: 'Hide in mobile',
                            key: 'hidden_mobile',
                            selector: 'tr',
                            _class: 'st-hide-mobile',
                          },
                          hiddenDesktop:
                          {
                            value: false,
                            title: 'Hide in desktop',
                            key: 'hidden_desktop',
                            selector: 'tr',
                            _class: 'st-hide-desktop',
                          },
                          resetPadding:
                          {
                            value: false,
                            title: 'Reset padding',
                            key: 'reset_padding',
                            selector: 'td:first',
                            _class: 'st-pd-0',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                    },
                    paletteBackgroundColor:
                    {
                      name: 'palette-background-color',
                      title: 'Palette Background color',
                      version: '0.0.1',
                      author: 'matias@stensul.com',
                      target: ['button', 'divider', 'image', 'text'],
                      config:
                      {
                        options:
                        {
                          bgcolor:
                          {
                            label: 'Background color',
                            key: 'bgcolor',
                            value: false,
                            palette: ['000000', '474646', '79A8C9', 'CD202C'],
                            defaultValue: 'transparent',
                          },
                        },
                      },
                      data: [],
                      render: true,
                      enabled: false,
                      subComponent: 'container',
                    },
                    textOptions:
                    {
                      name: 'text-options',
                      title: 'Text Editable',
                      version: '0.0.1',
                      author: 'emiliano@stensul.com',
                      target: ['button', 'text'],
                      config:
                      {
                        options:
                        {
                          undo:
                          {
                            label: 'Undo',
                            key: 'undo',
                            value: false,
                            icon: 'fa fa-undo',
                          },
                          redo:
                          {
                            label: 'Redo',
                            key: 'redo',
                            value: false,
                            icon: 'fa fa-repeat',
                          },
                          bold:
                          {
                            label: 'Bold',
                            key: 'bold',
                            value: true,
                            icon: 'fa fa-bold',
                          },
                          italic:
                          {
                            label: 'Italic',
                            key: 'italic',
                            value: true,
                            icon: 'fa fa-italic',
                          },
                          underline:
                          {
                            label: 'Underline',
                            key: 'underline',
                            value: true,
                            icon: 'fa fa-underline',
                          },
                          strikethrough:
                          {
                            label: 'Strikethrough',
                            key: 'strikethrough',
                            value: false,
                            icon: 'fa fa-strikethrough',
                          },
                          alignleft:
                          {
                            label: 'Align left',
                            key: 'alignleft',
                            value: false,
                            icon: 'fa fa-align-left',
                          },
                          aligncenter:
                          {
                            label: 'Align center',
                            key: 'aligncenter',
                            value: false,
                            icon: 'fa fa-align-center',
                          },
                          alignright:
                          {
                            label: 'Align right',
                            key: 'alignright',
                            value: false,
                            icon: 'fa fa-align-right',
                          },
                          superscript:
                          {
                            label: 'Superscript',
                            key: 'superscript',
                            value: false,
                            icon: 'fa fa-superscript',
                          },
                          fontselect:
                          {
                            label: 'Font',
                            key: 'fontselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-font',
                          },
                          fontsizeselect:
                          {
                            label: 'Font size',
                            key: 'fontsizeselect',
                            value: false,
                            icon: 'fa-adapter glyphicon glyphicon-text-size',
                          },
                          bullist:
                          {
                            label: 'Bullet list',
                            key: 'bullist',
                            value: false,
                            icon: 'fa fa-list-ul',
                          },
                          numlist:
                          {
                            label: 'Number list',
                            key: 'numlist',
                            value: false,
                            icon: 'fa fa-list-ol',
                          },
                          forecolor:
                          {
                            label: 'Font color',
                            key: 'forecolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-forecolor',
                            textcolor_map: ['000000', 'Black', '474646', 'Gray', '79a8c9', 'Blue', 'cd202c', 'Red'],
                            textcolor_from_library: false,
                            palette_name: '',
                          },
                          backcolor:
                          {
                            label: 'Background color',
                            key: 'backcolor',
                            value: false,
                            icon: 'font-mce-ico mce-i-backcolor',
                          },
                          link:
                          {
                            label: 'Link',
                            key: 'link',
                            value: false,
                            icon: 'fa fa-link',
                          },
                          styleselect:
                          {
                            label: 'Style Format',
                            key: 'styleselect',
                            value: false,
                            icon: 'fa fa-edit',
                          },
                        },
                        settings:
                        {
                          link_validate_url:
                          {
                            title: 'Validate Url',
                            value: false,
                          },
                          truncate:
                          {
                            title: 'Characters Limit',
                            value: false,
                            type: 'number',
                          },
                          lines_limit:
                          {
                            title: 'Lines Limit',
                            value: false,
                            type: 'text',
                            content: '{ "27px": 5, "29px": 4, "34px": 3 }',
                          },
                          fontsize_formats:
                          {
                            title: 'Font size',
                            value: false,
                            type: 'text',
                            content: '12px 14px 16px 18px',
                          },
                          style_formats:
                          {
                            title: 'Style format',
                            value: false,
                            type: 'text',
                            content: `[
                              {"title":"27px","block":"p","styles":{"fontSize":"27px","lineHeight":"30px"}},
                              {"title":"29px","block":"p","styles":{"fontSize":"29px","lineHeight":"32px"}},
                              {"title":"34px","block":"p","styles":{"fontSize":"34px","lineHeight":"36px"}}
                            ]`,
                          },
                          link_fixed_color:
                          {
                            title: 'Link fixed color',
                            value: false,
                            type: 'text',
                            dependsOn:
                            {
                              config: 'options',
                              name: 'link',
                            },
                          },
                        },
                      },
                      render: false,
                      enabled: true,
                    },
                  },
                }],
              plugins:
              {
                columnBackgroundColor:
                {
                  name: 'column-background-color',
                  title: 'Background color',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    defaultColors: [
                      '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                      '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
                    ],
                    defaultValue: '#ffffff',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                verticalAlignment:
                {
                  name: 'vertical-alignment',
                  title: 'Vertical alignment',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    options: ['top', 'middle', 'bottom'],
                    defaultValue: 'middle',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
                textColorByBackground:
                {
                  name: 'text-color-by-background',
                  title: 'Text Color by Background',
                  version: '0.0.1',
                  author: 'emiliano@stensul.com',
                  target: ['column'],
                  config:
                  {
                    lightText: '#FFFFFF',
                    darkText: '#000000',
                  },
                  data: [],
                  render: true,
                  enabled: false,
                },
              },
            }],
        },
        plugins:
        {
          moduleBackgroundColor:
          {
            name: 'module-background-color',
            title: 'Background color',
            version: '0.0.1',
            author: 'emiliano@stensul.com',
            target: ['module'],
            config:
            {
              defaultColors: [
                '#ffffff', '#323c44', '#cd263a', '#8d8d8d', '#9e00ff', '#0000ff',
                '#00da00', '#dada00', '#ff8d00', '#ff00de', '#a65628', '#848484',
              ],
              defaultValue: '#ffffff',
            },
            data: [],
            render: true,
            enabled: false,
          },
          textColorByBackgroundForModule:
          {
            name: 'text-color-by-background-for-module',
            title: 'Text Color by Background',
            version: '0.0.1',
            author: 'elias.torres@stensul.com',
            target: ['module'],
            config:
            {
              lightText: '#FFFFFF',
              darkText: '#000000',
            },
            data: [],
            render: true,
            enabled: false,
          },
        },
        status: 'publish',
        updated_at: '2018-08-24 14:42:58',
        created_at: '2018-08-24 14:42:58',
        isFixed: true,
        fixedPosition: -1,
        mandatory: true,
      }],
    body_html:
      `<table width="100%" cellspacing="0" cellpadding="0" border="0">\n
        <tr>\n
          <td class="st-email-wrapper" style="vertical-align: top;" bgcolor="#FFFFFF" align="center">\n
            <table class="st-wrapper-table" style="width: 660px;" 
              width="660" cellspacing="0" cellpadding="0" border="0">\n
              <tr>\n
                <td class="st-hide-hack">\n
                  <table width="660" cellspacing="0" cellpadding="0" border="0" align="center">\n
                    <tbody>\n
                      <tr>\n
                        <td cellpadding="0" cellspacing="0" border="0" 
                        style="background-color:#ffffff; line-height:1px; height: 1px; min-width: 660px;" height="1">\n
                          <img src="http://localhost:3000/_common/images/en_us/spacer.gif" 
                          style="" width="660" height="1">\n
                        </td>\n
                      </tr>\n
                    </tbody>\n
                  </table>\n
                </td>\n
              </tr>\n
              <tr>\n
                <td style="padding: 0px; border-width: 0px; border-style: none;" width="100%" valign="top" bgcolor="">\n
                  <table class="st-wrapper" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">\n
                    <tr>\n
                      <td class="st-mobile-full-width" style="vertical-align: top; width: 100%;" width="100%">\n
                        <table style="width: 100%;" width="100%" cellspacing="0" cellpadding="0" border="0">\n
                          <tr>\n
                            <td style="padding: 5px; width: 100%;" width="100%" valign="top" align="left">\n
                              <table style="width: 100%;" width="100%" cellspacing="0" cellpadding="0" border="0">\n
                                <tr>\n
                                  <td style="" width="100%" valign="top" align="left">\n
                                    <p style="margin: 0px;"><br></p>\n
                                  </td>\n
                                </tr>\n
                              </table>\n
                            </td>\n
                          </tr>\n
                        </table>\n
                      </td>\n
                    </tr>\n
                  </table>\n
                </td>\n
              </tr>\n
              <tr>\n
                <td style="padding: 0px; border-width: 0px; border-style: none;" width="100%" valign="top" bgcolor="">\n
                  <table class="st-wrapper" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">\n
                    <tr>\n
                      <td class="st-mobile-full-width" style="vertical-align: top; width: 100%;" width="100%">\n
                        <table style="width: 100%;" width="100%" cellspacing="0" cellpadding="0" border="0">\n
                          <tr>\n
                            <td style="padding: 5px; width: 100%;" width="100%" valign="top" align="left">\n
                              <table style="width: 100%;" width="100%" cellspacing="0" cellpadding="0" border="0">\n
                                <tr>\n
                                  <td style="" width="100%" valign="top" align="left">\n
                                    <p style="margin: 0px;">
                                      Lorem ipsum dolor sit amet&#44; consetetur sadipscing elitr&#44; 
                                      sed diam nonumy eirmod tempor invidunt ut labore et dolore 
                                      magna aliquyam erat&#44; sed diam voluptua.</p>\n
                                  </td>\n
                                </tr>\n
                              </table>\n
                            </td>\n
                          </tr>\n
                        </table>\n
                      </td>\n
                    </tr>\n
                  </table>\n
                </td>\n
              </tr>\n
              <tr>\n
                <td style="padding: 0px; border-width: 0px; border-style: none;" width="100%" valign="top" bgcolor="">\n
                  <table class="st-wrapper" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">\n
                    <tr>\n
                      <td class="st-mobile-full-width" style="vertical-align: top; width: 100%;" width="100%">\n
                        <table style="width: 100%;" width="100%" cellspacing="0" cellpadding="0" border="0">\n
                          <tr>\n
                            <td style="padding: 0px; width: 100%;" width="100%" valign="top" align="center">\n
                              <!---->\n
                              <!----> 
                              <a target="_blank" style="text-decoration: none;" href="">\n
                                <table style="width: 150px; border-collapse: initial;" 
                                  width="150" height="40" cellspacing="0" cellpadding="0" border="0">\n
                                  <tr>\n
                                    <td style="vertical-align: middle; width: 100%;" 
                                      width="100%" height="40" bgcolor="#514960">\n
                                      <table style="width: 100%;" width="100%" 
                                        cellspacing="0" cellpadding="0" border="0">\n
                                        <tr>\n
                                          <td style="" width="100%" valign="middle" align="center"> Lorem ipsum</td>\n
                                          <!---->\n
                                        </tr>\n
                                      </table>\n
                                    </td>\n
                                  </tr>\n
                                </table>\n
                              </a>\n
                              <!---->\n
                            </td>\n
                          </tr>\n
                        </table>\n
                      </td>\n
                    </tr>\n
                  </table>\n
                </td>\n
              </tr>\n
              <tr>\n
                <td class="st-wrapper-content" style="" 
                  width="100%" valign="top" bgcolor="">\n
                  <table class="st-wrapper" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">\n
                    <tr>\n
                      <td width="100%" valign="top">\n
                        <!--[if gte mso 9]>\n
                        <table width="660" cellpadding="0" cellspacing="0" border="0" style="" align="center">\n
                          <tr>\n
                            <td width="NaN" style="width:NaNpx !important" valign="top">\n
                              <![endif]-->\n
                              <table class="st-mobile-full-width st-mso-full-width" 
                                style="width: 330px;" width="330" cellspacing="0" cellpadding="0" 
                                border="0" align="left">\n
                                <tbody>\n
                                  <tr>\n
                                    <td style="width: 100%; padding: 0px;" width="100%" valign="top" align="center">\n
                                      <table style="width: 100%;" width="100%" 
                                        cellspacing="0" cellpadding="0" border="0">\n
                                        <tbody>\n
                                          <tr>\n
                                            <td style="padding: 0px; width: 100%;" 
                                              width="100%" valign="top" align="left">\n
                                              <table valign="top" style="width: 100%;" width="100%" 
                                                cellspacing="0" cellpadding="0" border="0" align="left">\n
                                                <tbody>\n
                                                  <tr>\n
                                                    <td style="width: 100%;" width="100%" valign="top">
                                                      <a href="" alt="Image" title="Image">
                                                        <img valign="top" src="" alt="Image" title="Image" 
                                                        class="st-resize" style="border: 0px none; display: block; 
                                                        width: 100%;" width="100%" border="0">\n
                                                        <!---->
                                                      </a>
                                                    </td>\n
                                                  </tr>\n
                                                </tbody>\n
                                              </table>\n
                                            </td>\n
                                          </tr>\n
                                        </tbody>\n
                                      </table>\n
                                    </td>\n
                                  </tr>\n
                                </tbody>\n
                              </table>\n
                              <!--[if gte mso 9]>\n
                            </td>\n
                            <td width="330" style='width:330px !important' align='left' valign='top'>\n
                              <![endif]-->\n
                                <table class="st-mobile-full-width st-mso-full-width" 
                                  style="width: 330px;" width="330" cellspacing="0" 
                                  cellpadding="0" border="0" align="left">\n
                                  <tbody>\n
                                    <tr>\n
                                      <td style="width: 100%; padding: 0px;" width="100%" valign="top" align="center">\n
                                        <table style="width: 100%;" width="100%" 
                                          cellspacing="0" cellpadding="0" border="0">\n
                                          <tbody>\n
                                            <tr>\n
                                              <td style="padding: 5px; width: 100%;" 
                                                width="100%" valign="top" align="left">\n
                                                <table style="width: 100%;" width="100%" 
                                                  cellspacing="0" cellpadding="0" border="0">\n
                                                  <tbody>\n
                                                    <tr>\n
                                                      <td style="" width="100%" valign="top" align="left">\n
                                                        <p style="margin: 0px;">
                                                          Lorem ipsum dolor sit amet&#44; consetetur sadipscing 
                                                          elitr&#44; sed 
                                                          diam nonumy eirmod tempor invidunt ut labore et dolore magna 
                                                          aliquyam erat&#44; sed diam voluptua.</p>\n
                                                      </td>\n
                                                    </tr>\n
                                                  </tbody>\n
                                                </table>\n
                                              </td>\n
                                            </tr>\n
                                          </tbody>\n
                                        </table>\n
                                      </td>\n
                                    </tr>\n
                                  </tbody>\n
                                </table>\n
                              <!--[if gte mso 9]>\n
                            </td>\n
                          </tr>\n
                        </table>\n
                        <![endif]-->\n
                      </td>\n
                    </tr>\n
                  </table>\n
                </td>\n
              </tr>\n
              <tr>\n
                <td class="st-wrapper-content" style="padding: 0px; border-width: 0px; border-style: none;" 
                  width="100%" valign="top" bgcolor="">\n
                  <table class="st-wrapper" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">\n
                    <tr>\n
                      <td width="100%" valign="top">\n
                        <!--[if gte mso 9]>\n
                        <table width="660" cellpadding="0" cellspacing="0" border="0" 
                          style="border-collapse: collapse; table-width: fixed;" align="center">\n
                          <tr>\n
                            <td width="NaN" style="width:NaNpx !important" valign="top">\n
                              <![endif]-->\n
                              <table class="st-mobile-full-width st-mso-full-width" 
                                style="width: 217.8px;" width="217.79999999999998" 
                                cellspacing="0" cellpadding="0" border="0" align="left">\n
                                <tbody>\n
                                  <tr>\n
                                    <td style="width: 100%; padding: 0px;" width="100%" valign="top" align="center">\n
                                      <table style="width: 100%;" width="100%" 
                                        cellspacing="0" cellpadding="0" border="0">\n
                                        <tbody>\n
                                          <tr>\n
                                            <td style="padding: 5px; width: 100%;" 
                                              width="100%" valign="top" align="left">\n
                                              <table style="width: 100%;" width="100%" 
                                                cellspacing="0" cellpadding="0" border="0">\n
                                                <tbody>\n
                                                  <tr>\n
                                                    <td style="" width="100%" valign="top" align="left">\n
                                                      <p style="margin: 0px;">
                                                        Lorem ipsum dolor sit amet&#44; consetetur sadipscing 
                                                        elitr&#44; sed diam nonumy eirmod tempor invidunt ut 
                                                        labore et dolore magna aliquyam erat&#44; sed diam 
                                                        voluptua. At vero eos et accusam et justo duo 
                                                        dolores et ea rebum.</p>\n
                                                    </td>\n
                                                  </tr>\n
                                                </tbody>\n
                                              </table>\n
                                            </td>\n
                                          </tr>\n
                                        </tbody>\n
                                      </table>\n
                                    </td>\n
                                  </tr>\n
                                </tbody>\n
                              </table>\n
                              <!--[if gte mso 9]>\n
                            </td>\n
                            <td width="217.79999999999998" 
                              style='width:217.79999999999998px !important' align='left' valign='top'>\n
                              <![endif]-->\n
                              <table class="st-mobile-full-width st-mso-full-width" 
                                style="width: 217.8px;" width="217.79999999999998" 
                                cellspacing="0" cellpadding="0" border="0" align="left">\n
                                <tbody>\n
                                  <tr>\n
                                    <td style="width: 100%; padding: 0px;" width="100%" valign="top" align="center">\n
                                      <table style="width: 100%;" width="100%" 
                                        cellspacing="0" cellpadding="0" border="0">\n
                                        <tbody>\n
                                          <tr>\n
                                            <td style="padding: 5px; width: 100%;" 
                                              width="100%" valign="top" align="left">\n
                                              <table style="width: 100%;" width="100%" 
                                                cellspacing="0" cellpadding="0" border="0">\n
                                                <tbody>\n
                                                  <tr>\n
                                                    <td style="" width="100%" valign="top" align="left">\n
                                                      <p style="margin: 0px;">
                                                        Lorem ipsum dolor sit amet&#44; consetetur sadipscing 
                                                        elitr&#44;
                                                        sed diam nonumy eirmod tempor invidunt ut labore et dolore 
                                                        magna aliquyam erat&#44; sed diam voluptua. At vero eos 
                                                        et accusam et justo duo dolores et ea rebum.</p>\n
                                                    </td>\n
                                                  </tr>\n
                                                </tbody>\n
                                              </table>\n
                                            </td>\n
                                          </tr>\n
                                        </tbody>\n
                                      </table>\n
                                    </td>\n
                                  </tr>\n
                                </tbody>\n
                              </table>\n
                              <!--[if gte mso 9]>\n
                            </td>\n
                            <td width="217.79999999999998" 
                              style='width:217.79999999999998px !important' align='left' valign='top'>\n
                              <![endif]-->\n
                              <table class="st-mobile-full-width st-mso-full-width" 
                                style="width: 217.8px;" width="217.79999999999998" 
                                cellspacing="0" cellpadding="0" border="0" align="left">\n
                                <tbody>\n
                                  <tr>\n
                                    <td style="width: 100%; padding: 0px;" width="100%" valign="top" align="center">\n
                                      <table style="width: 100%;" width="100%" 
                                        cellspacing="0" cellpadding="0" border="0">\n
                                        <tbody>\n
                                          <tr>\n
                                            <td style="padding: 5px; width: 100%;" 
                                              width="100%" valign="top" align="left">\n
                                              <table style="width: 100%;" width="100%" 
                                                cellspacing="0" cellpadding="0" border="0">\n
                                                <tbody>\n
                                                  <tr>\n
                                                    <td style="" width="100%" valign="top" align="left">\n
                                                      <p style="margin: 0px;">
                                                        Lorem ipsum dolor sit amet&#44; consetetur sadipscing 
                                                        elitr&#44; sed diam nonumy eirmod tempor invidunt ut 
                                                        labore et dolore magna aliquyam erat&#44; sed diam 
                                                        voluptua. At vero eos et accusam et justo duo 
                                                        dolores et ea rebum.</p>\n
                                                    </td>\n
                                                  </tr>\n
                                                </tbody>\n
                                              </table>\n
                                            </td>\n
                                          </tr>\n
                                        </tbody>\n
                                      </table>\n
                                    </td>\n
                                  </tr>\n
                                </tbody>\n
                              </table>\n
                              <!--[if gte mso 9]>\n
                            </td>\n
                          </tr>\n
                        </table>\n
                        <![endif]-->\n
                      </td>\n
                    </tr>\n
                  </table>\n
                </td>\n
              </tr>\n
            </table>\n
          </td>\n
        </tr>\
      </table>`,
    auto_save: true,
    template: false,
    campaign_settings: [],
    campaign_fonts:
    {
      system: ['Helvetica', 'Arial', 'Sans-serif'],
      web: ['Open Sans'],
      custom: [],
    },
  },
  updatedAt: '2018-10-03 12:04:42.000000',
};
