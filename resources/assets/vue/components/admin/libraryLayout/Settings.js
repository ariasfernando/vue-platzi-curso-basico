export default [
  {
    // groupLabel: 'groupLabel',
    settings: [
      {
        name: 'name',
        aclName: 'library-basic-settings',
        path: 'library',
        type: 'stui-input-text',
        validate: 'required',
        label: 'Name',
        placeholder: 'Enter name here.',
      },
      {
        name: 'description',
        aclName: 'library-basic-settings',
        path: 'library',
        type: 'stui-input-text',
        placeholder: 'Enter description here.',
        label: 'Description',
      },
      {
        name: 'esp',
        aclName: 'library-basic-settings',
        path: 'library.config',
        type: 'stui-toggle-button',
        settingSlot: 'setting-right',
        label: 'ESP',
      },
      {
        name: 'espProvider',
        aclName: 'library-basic-settings',
        path: 'library.config',
        listPath: 'espList',
        type: 'stui-select',
        settingSlot: 'setting-right',
        label: 'ESP name',
        dependsOn: [{ path: 'library.config.esp' }],
      },
      {
        name: 'preheader',
        aclName: 'library-basic-settings',
        path: 'library.config',
        type: 'stui-toggle-button',
        label: 'Preheader',
        settingSlot: 'setting-right',
        dependsOn: [{ path: 'campaignConfig.preview.show_preheader' }],
      },
      {
        name: 'preheaderDefault',
        aclName: 'library-basic-settings',
        label: 'Preheader default',
        path: 'library.config',
        type: 'stui-input-text',
        settingSlot: 'setting-right',
        dependsOn: [
          { path: 'campaignConfig.preview.show_preheader' },
          { path: 'library.config.preheader' },
        ],
      },
      {
        name: 'plainText',
        aclName: 'library-basic-settings',
        type: 'stui-toggle-button',
        path: 'library.config',
        label: 'Plain text',
        settingSlot: 'setting-right',
        dependsOn: [{ path: 'campaignConfig.process_plaintext' }],
      },
      {
        name: 'tagging',
        aclName: 'library-basic-settings',
        type: 'stui-toggle-button',
        path: 'library.config',
        label: 'Tags',
        settingSlot: 'setting-right',
        dependsOn: [{ path: 'campaignConfig.enable_tagging' }],
      },
      {
        name: 'templating',
        aclName: 'library-basic-settings',
        type: 'stui-toggle-button',
        label: 'Enable templating',
        path: 'library.config',
        settingSlot: 'setting-right',
        dependsOn: [{ path: 'campaignConfig.enable_templating' }],
      },
      {
        name: 'tracking',
        aclName: 'library-basic-settings',
        type: 'stui-toggle-button',
        label: 'Enable Tracking',
        path: 'library.config',
        settingSlot: 'setting-right',
        dependsOn: [{ path: 'campaignConfig.enable_tracking' }],
      },
      {
        name: 'htmlToPdf',
        aclName: 'library-basic-settings',
        type: 'stui-toggle-button',
        label: 'PDF Download',
        path: 'library.config',
        settingSlot: 'setting-right',
        dependsOn: [{ path: 'campaignConfig.download_pdf' }],
      },
    ],
  },
];
