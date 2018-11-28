function textOptions() {
  return {
    enabled: true,
    config: {
      toolbarString: 'undo redo | alignleft aligncenter alignright alignjustify | bold italic underline | link | forecolor backcolor',
      settings: {
        link_validate_url: {
          content: 'disabled',
        },
        truncate: {
          content: false,
        },
        lines_limit: {
          content: false,
        },
        fontsize_formats: {
          content: [{
              value: '12px',
            },
            {
              value: '14px',
            },
            {
              value: '16px',
            },
            {
              value: '18px',
            },
          ],
        },
        link_fixed_color: {
          content: false,
        },
        formats: {
          content: '{"light_font":{"inline":"span","styles":{"fontWeight":"300"}},"normal_font":{"inline":"span","styles":{"fontWeight":"400"}},"semi_bold_font":{"inline":"span","styles":{"fontWeight":"600"}},"bold_font":{"inline":"span","styles":{"fontWeight":"700"}}}',
        },
      },
    },
  };
}

module.exports = textOptions;
