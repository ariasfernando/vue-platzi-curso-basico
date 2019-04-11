const campaignCleaner = {
	  /**
   * Hook which runs before cleaner
   * @param {jQuery} $cleanedHtml
   * @returns {jQuery} $newCleanedHtml
   */
  preCleanHook($cleanedHtml) {
		this.replacePWidthSpan($cleanedHtml);
		this.addOutlookLineHeight($cleanedHtml)

		return $cleanedHtml;
	},
	replacePWidthSpan($cleanedHtml) {
		$cleanedHtml
			.find('.st-replace-p-with-span p')
			.each((i, element) => $(element).replaceWith(function(){
				return $("<span />", {html: $(this).html()});
			}));
	},
	addOutlookLineHeight($cleanedHtml) {
		$cleanedHtml.find('.st-replace-p-with-span')
			.each((index, element) => {
				const html = $(element)
					.html()
					.replace(/mso-line-height-rule: ?exactly;\s*/g, '')
					.replace(/line-height: ?([^;]+);/g, 'mso-line-height-rule: exactly; line-height: $1;');
				$(element).html(html);
			});
	},
};

export default campaignCleaner;
