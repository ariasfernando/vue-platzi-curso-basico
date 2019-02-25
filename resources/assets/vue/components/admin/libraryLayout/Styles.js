export default [
  {
    settings: [
      {
        name: 'templateWidth',
        aclName: 'library-basic-settings',
        path: 'library.config',
        type: 'stui-input-number',
        validate: 'required',
        settingSlot: 'setting-half',
        label: 'Template width',
      },
      {
        name: 'templateMobileWidth',
        aclName: 'library-basic-settings',
        path: 'library.config',
        type: 'stui-input-number',
        settingSlot: 'setting-half',
        validate: 'required',
        label: 'Mobile Width',
      },
      {
        name: 'templateBackgroundColor',
        aclName: 'library-basic-settings',
        path: 'library.config',
        settingSlot: 'setting-right',
        type: 'stui-color-picker',
        label: 'Template BG',
      },
      {
        name: 'externalCssLink',
        aclName: 'library-basic-settings',
        path: 'library.config',
        type: 'stui-input-text',
        placeholder: 'http://www.example.com/css/styles.css',
        label: 'External CSS Link',
      },
      {
        name: 'colorPalettes',
        aclName: 'library-advance-settings',
        path: 'library.config',
        type: 'stui-input-text',
        placeholder:
          '{"palette_name":["000000","Black","474646","Gray","79a8c9","Blue","cd202c","Red"]}',
        label: 'Color palettes',
      },
      {
        name: 'templateBackgroundPalettes',
        path: 'library.config',
        type: 'stui-input-text',
        aclName: 'library-advance-settings',
        placeholder:
          '{ "default": "#FFFFFF", "options": { "White": "#FFFFFF", "Black": "#000000" } }',
        label: 'Template background palettes',
      },
      {
        click: 'openPropietaryStyles',
        aclName: 'library-basic-settings',
        type: 'stui-button',
        width: 'full',
        propType: 'secondary',
        text: 'Add Proprietary Styles',
      },
    ],
  },
];
