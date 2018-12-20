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
        label: 'Background color',
        icon: 'font-mce-ico mce-i-backcolor',
      },
      link: {
        label: 'Link',
        icon: 'fa fa-link',
      },
      stformatsmenu: {
        label: 'Custom Format',
        icon: 'fa fa-edit',
      },
    },
    settings: {
      link_validate_url: {
        key: 'link_validate_url',
        title: 'Validate URL',
        type: 'select',
        options: {
          disabled: 'No Validation',
          url: 'Validate Format',
          urlAndDestination: 'Format and Destination',
        },
        dependsOn: {
          config: 'options',
          name: 'link',
        },
      },
      truncate: {
        key: 'truncate',
        title: 'Characters Limit',
        type: 'input-toggleable-number',
        falseText: 'Disabled',
      },
      lines_limit: {
        key: 'lines_limit',
        title: 'Lines Limit',
        type: 'input-toggleable-number',
        falseText: 'Disabled',
        defaultValue: 2,
        isDisabled: value => (Application.utils.isJsonObjectString(value)),
      },
      lines_limit_advanced: {
        key: 'lines_limit',
        title: 'Lines Limit',
        type: 'input-toggleable-text',
        falseText: 'Disabled',
        defaultValue: '2',
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
      link_fixed_color: {
        key: 'link_fixed_color',
        title: 'Link fixed color',
        type: 'input-toggleable-text',
        falseText: 'Disabled',
        defaultValue: '#000000',
        dependsOn: {
          config: 'options',
          name: 'link',
        },
      },
      formats: {
        key: 'formats',
        title: 'Formats',
        type: 'text',
        dependsOn: {
          config: 'options',
          name: 'stformatsmenu',
        },
      },
    },
  };
}

module.exports = configsView;
