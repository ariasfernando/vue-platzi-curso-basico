export default {
  filters: {
    charConvert(value) {
      if (!value) return '';
      return value.replace(/&amp;/g, '&');
    },
  },
};
