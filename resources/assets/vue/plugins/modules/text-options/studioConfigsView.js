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
        title: 'Char Limit',
        type: 'stui-input-autodisable',
        props: {
          disableOn: 0,
          autodisableComponent: 'stui-input-number',
          min: 0,
        },
        checkbox: {
          valueOnTrue: 1,
        },
      },
      lines_limit: {
        key: 'lines_limit',
        title: 'Lines Limit',
        type: 'stui-input-autodisable',
        isDisabled: value => (Application.utils.isJsonObjectString(value)),
        props: {
          disableOn: 0,
          autodisableComponent: 'stui-input-number',
          min: 0,
        },
        checkbox: {
          valueOnTrue: 2,
        },
      },
      lines_limit_advanced: {
        key: 'lines_limit',
        title: 'Lines Limit',
        type: 'stui-input-autodisable',
        props: {
          disableOn: '0',
        },
        checkbox: {
          valueOnTrue: 2,
        },
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
        title: 'Link color',
        type: 'stui-input-autodisable',
        falseText: 'none',
        dependsOn: {
          config: 'options',
          name: 'link',
        },
        props: {
          autodisableComponent: 'stui-color-picker',
        },
        checkbox: {
          valueOnTrue: '#000000',
        },
      },
    },
  };
}

module.exports = configsView;
