var ModuleActions = ModuleActions || {};

ModuleActions.free_range_text_paragraph = function( ){

    this.init = function ( $element ) {
        var $elements = $element.find("[data-line-limit]");

        _.each($elements, function(el) {
            Application.helpers.limitLines(el);
        });
    }

};