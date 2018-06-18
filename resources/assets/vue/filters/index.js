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
};
