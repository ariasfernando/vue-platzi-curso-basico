/*
 * TinyMCE custom tags plugin
 * Get the tag_values from plugin config in modals.php
 */
tinymce.PluginManager.add('stbulletedlist', function(editor) {
    if( editor ){

        var _this = this;

        // Override tinymce settings if rewrite_bulleted_list_settings is not true
        if( !editor.settings.rewrite_bulleted_list_settings ){
            editor.settings.valid_children = '-td[div|p],-tr[div|p],-table[div|p]';
            editor.settings.invalid_elements = 'div,p';
            editor.settings.noneditable_noneditable_class = 'mceNonEditable';
            editor.settings.table_grid = false;
            editor.settings.object_resizing = false;
            editor.settings.forced_root_block = "";
            editor.settings.force_br_newline = false;
            editor.settings.force_p_newline = false;
            editor.settings.editableElements = "td,a,b,i,span,u,strong";
        }

        var cleanChildNodes = function(){
            var editorChildNodes = $(editor.targetElm)[0].childNodes;
            for(var i = 0; i<=editorChildNodes.length; i++){
                if( editorChildNodes[i] && editorChildNodes[i].nodeName !== "TABLE" ){
                    editorChildNodes[i].remove();
                }
            };
        };

        // Used to remove a row.
        var onDelete = function(event){
            if(event.which === 8 || event.which === 48 ){
                var node = getNode();
                $table = $(node).parents('table.st-bulleted-list');

                if( !$(node).is(editor.settings.editableElements) && !$(node).hasClass("mceNonEditable") ){
                    event.preventDefault();
                    return false;
                }

                if( $(node).text() === "" ){
                    if( $table.find("tr").length > 1 ){
                        var $prevRow = $(node).parent().prev();
                        $(node).parent().remove();
                        event.preventDefault();
                    }
                }
            }

        };
        var getRowAttr = function(){
            $td = $(editor.targetElm).find('table.st-bulleted-list tr td:eq(1)');
            return $td[0].attributes;
        };
        // Build row element, return jQuery element.
        var buildRow = function(){
            var $row = $('<tr>');
            $row.append($(editor.targetElm).find('table.st-bulleted-list tr td.mceNonEditable:eq(0)').clone());
            var $td = $('<td>');
            $td.text("Lorem ipsum dolor sit amet.");
            $.each(getRowAttr(),function(index,attr){
                $td.attr(attr.name,attr.value);
            });
            $row.append($td);

            return $row;
        };

        // Add a new row in table
        var addRow = function(){
            var node = getNode();
            $table = $(editor.targetElm).find('table.st-bulleted-list');
            var $newRow = buildRow();
            addRowRemoveIcon($newRow);

            if( validateNode() && $(node).is($(editor.targetElm).find("table.st-bulleted-list *")) ){
                $(node).closest("tr").after($newRow);
            }else{
                $table.append($newRow);
            }
        };

        var removeRow = function($row){
            if( $row.siblings().length ){
                $row.remove();
            }
        };

        var addRowRemoveIcon = function($row){
            var $removeIcon = $('<div class="delete-row mceNonEditable"><i class="fa fa-times" aria-hidden="true"></i></div>');

            $removeIcon.click(function(){
                removeRow($(this).parent());
                return false;
            });

            if(!$row.find(".delete-row").length){
                $row.append($removeIcon);
            }
        };

        // Validate if node is able to be edited.
        var validateNode = function( event ){
            var node = getNode();

            if( !event ){
                if( !$(node).is(editor.settings.editableElements) || $(node).is("td.mceNonEditable") ){
                    return false;
                }
            }else{
                // Allow cursor arrows
                if( [37,38,39,40].indexOf(event.which) >= 0 ){
                    return true;
                }
                if($(node).is("div#mcepastebin")){
                    return true;
                }

                // Prevent key actions outside editable td.
                if( !$(node).is(editor.settings.editableElements)
                    || $(node).is("td.mceNonEditable")
                    || $(node).is(".delete-row, .delete-row i")
                    || (event.shiftKey && event.which === 13)){
                    return false;
                }
            }


            return true;
        };

        // Return current node element
        var getNode = function(){
            return editor.selection.getNode();
        };

        // Add CSS Class to table element.
        $(editor.targetElm).find("table").addClass("st-bulleted-list");


        editor
            .on("focus",function(){
                $.each($(this.targetElm).find("tr"),function(index, row){
                    if(!$(row).find(".delete-row").length){
                        addRowRemoveIcon($(row));
                    }
                });
            })
            .on("blur",function(){
                $.each($(this.targetElm).find(".delete-row"),function(index, removeIcon){
                    $(removeIcon).remove();
                });

                cleanChildNodes();
            });

        // Attach events
        editor
            .on('click change', function (e) {
                // Fix remove icon when a link was added.
                $.each($(this.targetElm).find("tr"),function(index, row){
                    if(!$(row).find(".delete-row").length){
                        addRowRemoveIcon($(row));
                    }
                });
            })
            // Prevent drag and drop.
            .on('dragover drop', function (e) {
                e.preventDefault();
                return false;
            })
            .on("paste",function(event){
                var node = getNode();
                // Prevent key events outside td element.
                if( !validateNode(event) ){ 
                    event.preventDefault();
                    return false;
                }
            })
            // On keydown event.
            .on("keyup",function(event){
                if( !validateNode(event) ){
                    cleanChildNodes();
                }
            })
            .on("keydown cut",function(event){
                // Prevent key events outside td element.
                if( !validateNode(event) ){
                    event.preventDefault();
                    return false;
                }

                onDelete(event);
            });

        // Add button in tinymce toolbar
        editor.addButton('stbullist', {
            tooltip: 'Add new row',
            text: '',
            icon: 'plus',
            onclick: function (e) {
                addRow();
            }
        });
        
    }

});