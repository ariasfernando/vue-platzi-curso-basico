const plugin = {
  id: 'rich-editor',
  name: 'Rich Editor',
  fields: [
    {
      label: 'Fixed',
      name: 'fixed',
      type: 'switch',
      value: false,
    },
    {
      label: 'Bold / Italic',
      name: 'bold italic',
      type: 'switch',
      value: true,
    },
    {
      label: 'Undo / Redo',
      name: 'undo redo',
      type: 'switch',
      value: true,
    },
    {
      label: 'Underline',
      name: 'underline',
      type: 'switch',
      value: true,
    },
    {
      label: 'link',
      name: 'link',
      type: 'switch',
      value: true,
    },
  ],
  init: (v) => {
    console.log('[Init Plugin] Rich Editor');
    const $wrapper = $('.plugin-rich-editor');
    const $fixedField = $('.field-fixed .vue-js-switch');

    // Load data
    if ($fixedField.is('.toggled')) {
      $wrapper.find('input').attr('disabled', true).parent().css('cursor', 'not-allowed');
      $fixedField.find('input').removeAttr('disabled').parent().css('cursor', 'pointer');
    } else {
      $wrapper.find('input').removeAttr('disabled').parent().css('cursor', 'pointer');
    }

    // Handle changes
    $fixedField.find('input').change((e) => {
      if ($fixedField.is('.toggled')) {
        $wrapper.find('input').attr('disabled', true).parent().css('cursor', 'not-allowed');
        $fixedField.find('input').removeAttr('disabled').parent().css('cursor', 'pointer');
      } else {
        $wrapper.find('input').removeAttr('disabled').parent().css('cursor', 'pointer');
      }
    });
  },
};

module.exports = plugin;
