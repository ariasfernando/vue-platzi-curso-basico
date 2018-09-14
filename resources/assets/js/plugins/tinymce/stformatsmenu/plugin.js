/*
 * TinyMCE custom tags plugin
 * Get the tag_values from plugin config in modals.php
 * @stcustomtags_values (array)
 */
tinymce.PluginManager.add('stformatsmenu', function (editor) {
    var menu_formats = [];

    if (editor && editor.settings.st_formats_menu && editor.settings.st_formats_menu.length) {
        // Get custom tags from options
        menu_formats = editor.settings.st_formats_menu;

        // Add button
        editor.addButton('stformatsmenu', {
            type: 'listbox',
            text: '',
            icon: 'editimage',
            tooltip: 'Format',
            values: menu_formats,
            onselect: function (e) {
                var selected = this.value();

                if (selected) {

                    var match = editor.settings.st_formats_menu.filter(function (i) {
                        return i.value == selected;
                    });

                    editor.focus();
                    editor.formatter.toggle(match[0].value);

                    this.value('');
                }
            },
            onPostRender: function () {
                this.value('');
            }
        });
    }
});