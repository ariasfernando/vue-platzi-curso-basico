(function ( $ ) {
    Application = Application || {};
    Application.helpers = Application.helpers || {};

    Application.helpers.inlineColorpicker = function (options) {
        var color = options.data.color;
        var value = options.data.value;
        $(options.modalSelector).find(options.colorpickerSelector).append($("<option>").attr('value', value).text(color));

        // Append detail to background select.
        setTimeout(function () {
            $(options.modalSelector).find('.simplecolorpicker span[title="' + color + '"]')
                .append($('<span>').text(color))
                .append($('<span>').text(value));
        }, 100);

        // add style to background select.
        $(options.modalSelector).on("click", "span.color", function () {
            $(options.modalSelector).find('.simplecolorpicker .color').removeAttr('data-selected');
            $(this).attr('data-selected', '');
            return false;
        });
    }
})(jQuery);
