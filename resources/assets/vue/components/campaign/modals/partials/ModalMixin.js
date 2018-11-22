export default {
	filters: {
		charConvert: function (value) {
			if (!value) return '';
			return value.replace(/&amp;/g, '&');
		}
	}
}