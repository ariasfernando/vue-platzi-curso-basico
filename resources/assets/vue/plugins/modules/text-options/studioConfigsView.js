function configsView() {
  return {
    options: {
      bold: {
        label: 'Bold',
        icon: 'fa fa-bold',
      },
      italic: {
        label: 'Italic',
        icon: 'fa fa-italic',
      },
      underline: {
        label: 'Underline',
        icon: 'fa fa-underline',
      },
      strikethrough: {
        label: 'Strikethrough',
        icon: 'fa fa-strikethrough',
      },
      superscript: {
        label: 'Superscript',
        icon: 'fa fa-superscript',
      },
      fontsizeselect: {
        label: 'Font size',
        icon: 'fa-adapter glyphicon glyphicon-text-size',
      },
      alignleft: {
        label: 'Align left',
        icon: 'fa fa-align-left',
      },
      aligncenter: {
        label: 'Align center',
        icon: 'fa fa-align-center',
      },
      alignright: {
        label: 'Align right',
        icon: 'fa fa-align-right',
      },
      alignjustify: {
        label: 'Align justify',
        icon: 'fa fa-align-justify',
      },
      bullist: {
        label: 'Bullet list',
        icon: 'fa fa-list-ul',
      },
      numlist: {
        label: 'Number list',
        icon: 'fa fa-list-ol',
      },
      forecolor: {
        label: 'Font color',
        icon: 'font-mce-ico mce-i-forecolor',
      },
      backcolor: {
        label: 'Highlight color',
        icon: 'font-mce-ico mce-i-backcolor',
      },
      link: {
        label: 'Link',
        icon: 'fa fa-link',
      },
    },
    settings: {
      truncate: {
        key: 'truncate',
        title: 'Char Limit',
        type: 'stui-input-number',
        checkbox: true,
        defaultValue: 50,
        min: 0,
        muteOn: [0, false],
      },
      lines_limit: {
        key: 'lines_limit',
        title: 'Lines Limit',
        type: 'stui-input-number',
        checkbox: true,
        defaultValue: 2,
        isDisabled: value => (Application.utils.isJsonObjectString(value)),
        min: 0,
        muteOn: [0, false],
      },
      lines_limit_advanced: {
        key: 'lines_limit',
        title: 'Lines Limit',
        type: 'stui-input-text',
        checkbox: true,
        defaultValue: 2,
        falseText: '0',
        muteOn: ['0', 0, false],
      },
      fontsize_formats: {
        key: 'fontsize_formats',
        title: 'Font size',
        type: 'text',
        dependsOn: {
          config: 'options',
          name: 'fontsizeselect',
        },
      },
      link_validate_url: {
        key: 'link_validate_url',
        title: 'Validate URL',
        type: 'select',
        dependsOn: {
          config: 'options',
          name: 'link',
        },
        options: {
          disabled: 'No Validation',
          url: 'Validate Format',
          urlAndDestination: 'Format and Destination',
        },
      },
      link_fixed_color: {
        key: 'link_fixed_color',
        title: 'Link color',
        type: 'stui-color-picker',
        checkbox: true,
        defaultValue: '#000000',
        dependsOn: {
          config: 'options',
          name: 'link',
        },
        falseText: 'none',
        muteOn: [false],
      },
      link_format: {
        key: 'link_format',
        aclName: 'link_fixed_color',
        title: 'Link Format',
        type: 'stui-icon-checklist',
        dependsOn: {
          config: 'options',
          name: 'link',
        },
        list: [
          {
            label: 'Bold',
            icon: 'fa fa-bold',
            key: 'bold',
          },
          {
            label: 'Underline',
            icon: 'fa fa-underline',
            key: 'underline',
          },
        ],
      },
    },
  };
}

module.exports = configsView;
