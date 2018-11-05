module.exports = {
  removeHTML: (value) => {
    if (!value) {
      return '';
    }
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.body.textContent || '';
  },
  escapeHTML: (value) => {
    if (!value) {
      return '';
    }
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },
  capitalize: (value) => {
    if (!value) {
      return '';
    }
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
  },
  parseValidationErrors: (error) => {
    if (error.body && error.body.errors) {
      const errors = error.body.errors || {};
      let messages = '<b>Please fix these errors before saving:</b><br />';
      for (const index in errors) {
        if (errors.hasOwnProperty(index)) {
          messages += `<u>${index.charAt(0).toUpperCase() + index.slice(1)}</u>: ${errors[index]}<br />`;
        }
      }

      return errors ? messages : '';
    }
    return '';
  },
};
