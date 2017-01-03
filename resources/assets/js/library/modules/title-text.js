/*
 | Module actions: Title Text
 */
var ModuleActions = ModuleActions || {};

ModuleActions.title_text = function () {
    var $module = null;

    /* -- on TinyMCE Init -- */
    this.onTinymceInit = function( editor ){
        editor.on('change', function (e) {
            // Apply color to all text.
            var node = editor.selection.getNode();
            var style = $(node).data("mce-style");

            if( typeof style != 'undefined' ){
                var textContent = tinyMCE.activeEditor.getContent({format: 'text'});
                tinyMCE.activeEditor.setContent('<span style="'+style+'" data-mce-style="'+style+'">'+textContent+'</span>');
            }
        });
    }
};