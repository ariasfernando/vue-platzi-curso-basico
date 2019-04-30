/*
 * TinyMCE custom str plugin
 * Get the str_values from plugin config in modals.php
 * @stcustomstr_values (array)
 */
tinymce.PluginManager.add('stcustomstr', function(editor) {
    var str_values = [
      { "text" : "®",  "value" : "®",  "placeholder" : "®"  },
      { "text" : "™",  "value" : "™",  "placeholder" : "™"  },
      { "text" : "©",  "value" : "©",  "placeholder" : "©"  }
    ]
    var tooltip = "Special character";

    if( editor ){
        // Get custom str from options
        if(editor.settings.stcustomstr_values !== undefined)
          str_values = editor.settings.stcustomstr_values;

        // Get custom tooltip text
        if( editor.settings.stcustomstr_tooltip ){
            tooltip = editor.settings.stcustomstr_tooltip;
        }

        // Add button
        editor.addButton('stcustomstr', {
            type: 'listbox',
            text: '',
            icon: 'charmap',
            tooltip: tooltip,
            values: str_values,
            onselect: function (e) {
                var selected = this.value();

                if ( selected ){

                    var match = str_values.filter(function(i){
                        return i.value == selected;
                    })

                    editor.insertContent('<span>' + ( match[0].placeholder || selected ) + '</span>&nbsp;');
                    $(editor.targetElm).blur();

                    this.value('');
                }
            },
            onPostRender: function () {
                this.value('');
            }
        });
    }
});
