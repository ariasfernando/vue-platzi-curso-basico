(function ( $ ) {
    Application = Application || {};
    Application.helpers = Application.helpers || {};

    /**
     * Checks the maximum number of lines of a given element
     * Returns if the limit was reached and optionally notifies user
    **/
    Application.helpers.limitLines = function(el, showNotifications) {
        var divHeight, lineHeight, actualLines = undefined;
        var $textElement = $(el);
        var maxLines = $textElement.data('line-limit');
        var hasError = $textElement.is('.error');
        var errorMsg = $textElement.data('error-msg') || "You've reached the maximum number of lines";

        if (!maxLines) {
            return false;
        }

        showNotifications = (showNotifications === false) ? false : true;
        var notifications = showNotifications ? Application.utils.notifications() : undefined;

        maxLines = +maxLines;

        // Verify current lines
        checkLines();

        if (actualLines > maxLines) {
            if (!hasError) {
                if (showNotifications) {
                    notifications.create({
                        theme: 'stensul',
                        layout: 'topRight',
                        text: errorMsg,
                        type: 'error',
                        killer: true
                    }, $textElement);
                }

                $textElement.addClass('error');
            }

            return false;
        } else {
            $textElement.removeClass('error');
            if (showNotifications) {
                notifications.closeAll();
            }

            return true;
        }

        function checkLines() {
            divHeight = $textElement.height();
            lineHeight = parseInt($textElement.css("lineHeight"));
            actualLines = divHeight / lineHeight;
        }
    };

})(jQuery);