/*
 * TinyMCE custom tags plugin
 * Get the tag_values from plugin config in modals.php
 */


tinymce.PluginManager.add('stbulletedlist', function(editor){
    if (editor) {
        var _this = this;

        // Override tinymce settings if rewrite_bulleted_list_settings is not true
        if (!editor.settings.rewrite_bulleted_list_settings) {
            editor.settings.valid_children = '-td[div|p],-tr[div|p],-table[div|p]';
            editor.settings.invalid_elements = 'div,p';
            editor.settings.noneditable_noneditable_class = 'mceNonEditable';
            editor.settings.table_grid = false;
            editor.settings.object_resizing = false;
            editor.settings.forced_root_block = "";
            editor.settings.force_br_newline = false;
            editor.settings.force_p_newline = false;
            editor.settings.editableElements = "td,a,b,i,span,u,strong";
            editor.settings.tableClassName = "stx-bulleted-list";
        }

        var cleanChildNodes = function() {
            var editorChildNodes = $(editor.targetElm)[0].childNodes;
            for (var i = 0; i <= editorChildNodes.length; i++) {
                if (editorChildNodes[i] && editorChildNodes[i].nodeName !== "TABLE") {
                    editorChildNodes[i].remove();
                }
            };
        };

        // Used to remove a row.
        var onDelete = function(event) {
            if (event.which === 8 || event.which === 48) {
                var node = getNode();
                $table = $(node).parents('table.'+editor.settings.tableClassName);

                if (!$(node).is(editor.settings.editableElements) && !$(node).hasClass("mceNonEditable")) {
                    event.preventDefault();
                    return false;
                }

                if ($(node).text() === "") {
                    if ($table.find("tr").length > 1) {
                        var $prevRow = $(node).parent().prev();
                        $(node).parent().remove();
                        event.preventDefault();
                    }
                }
            }

        };
        var getRowAttr = function() {
            $td = $(editor.targetElm).find('table.'+editor.settings.tableClassName+' tr td:eq(1)');
            return $td[0].attributes;
        };
        // Build row element, return jQuery element.
        var buildRow = function() {
            var $row = $('<tr>');
            $row.append($(editor.targetElm).find('table.'+editor.settings.tableClassName+' tr td.mceNonEditable:eq(0)').clone());
            var $td = $('<td>');
            $td.text("Nunc volutpat sem vitae sagittis a laoreet urna. Quisquw derehce menos.");
            $.each(getRowAttr(), function(index, attr) {
                $td.attr(attr.name, attr.value);
            });
            $row.append($td);

            return $row;
        };

        // Add a new row in table
        var addRow = function() {
            var node = getNode();
            $table = $(editor.targetElm).find('table.'+editor.settings.tableClassName);
            var $newRow = buildRow();
            addColRemoveIcon($newRow);

            if (validateNode() && $(node).is($(editor.targetElm).find("table."+editor.settings.tableClassName+" *"))) {
                $(node).closest("tr").after($newRow);
            } else {
                $table.append($newRow);
            }
        };

        var removeRow = function($row) {
            if ($row.siblings().length) {
                $row.remove();
            }
        };

        const addColRemoveIcon = function ($row) {
            const $colRemoveIcon = $('<td class="delete-row mceNonEditable st-remove-element"></td>');
            if (!$row.find('.delete-row').length) {
                $row.append(addRemoveIcon($colRemoveIcon));
            } else {
                const $col = $($row.find('.delete-row')[0]);
                if (!$col.find('.fa-times').length) {
                    addRemoveIcon($col);
                }
            }
        };

        const addRemoveIcon = function ($col) {
            let $removeIcon = $('<i class="fa fa-times" aria-hidden="true"></i>');
            $col.append($removeIcon);
            return $col;
        };

        // Validate if node is able to be edited.
        var validateNode = function(event) {
            var node = getNode();

            if (!event) {
                if (!$(node).is(editor.settings.editableElements) || $(node).is("td.mceNonEditable")) {
                    return false;
                }
            } else {
                // Allow cursor arrows
                if ([37, 38, 39, 40].indexOf(event.which) >= 0) {
                    return true;
                }
                if ($(node).is("div#mcepastebin")) {
                    return true;
                }

                // Prevent key actions outside editable td.
                if (!$(node).is(editor.settings.editableElements) ||
                    $(node).is("td.mceNonEditable") ||
                    $(node).is(".delete-row, .delete-row i") ||
                    (event.shiftKey && event.which === 13)) {
                    return false;
                }
            }


            return true;
        };

        // Return current node element
        var getNode = function() {
            return editor.selection.getNode();
        };

        // Add CSS Class to table element.
        $(editor.targetElm).find("table").addClass(editor.settings.tableClassName);

        // Delete row
        $(editor.targetElm).on('click','.delete-row',function(){
            removeRow($(this).parent());
            return false;
        });

        editor
            .on("focus", function() {
                $.each($(this.targetElm).find("tr"), function(index, row) {
                    addColRemoveIcon($(row));
                });
            })
            .on("blur", function() {
                $.each($(this.targetElm).find(".delete-row"), function(index, removeIcon) {
                    $(removeIcon).remove();
                });
                cleanChildNodes();
            })
            .on('keydown', function(e) {
                var $textElement = $('#' + tinyMCE.activeEditor.id);
                var allowKeys = [
                    //  key      keyCode
                    'Backspace', 8,
                    'Delete', 46,
                    'Tab', 9,
                    'Escape', 27,
                    'Home', 36,
                    'End', 35,
                    'ArrowLeft', 37,
                    'ArrowRight', 39,
                    'ArrowUp', 38,
                    'ArrowDown', 40
                ];

                var code = null;
                if (e.key !== undefined) {
                    code = e.key;
                } else if (e.keyCode !== undefined) {
                    code = e.keyCode;
                }

                if ($.inArray(code, allowKeys) !== -1 ||
                    // Allow: Ctrl+A,Ctrl+C, Ctrl+X
                    ((e.keyCode == 65 || e.keyCode == 67 || e.keyCode == 88) && (e.ctrlKey === true || e.metaKey === true))
                ) {
                    return;
                }

                $.each($($textElement).find('tr'), function(index, row) {

                    tinyLength = $(row).find('td')[1].innerText.length;
                    if (tinyLength > editor.settings.max_chars_stbullist) {
                        // Prevent insertion of typed character
                        $textElement.trigger('stbulletedlist-max-chars-error', [editor.settings.max_chars_stbullist])
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }

                });
            })
            .on('click', function(e) {
                // Fix remove icon when a link was added.
                $.each($(this.targetElm).find("tr"), function(index, row) {
                    addColRemoveIcon($(row));
                });
            })
            // Prevent drag and drop.
            .on('dragover drop', function(e) {
                e.preventDefault();
                return false;
            })
            .on("paste", function(event) {
                var node = getNode();
                // Prevent key events outside td element.
                if (!validateNode(event)) {
                    event.preventDefault();
                    return false;
                }
            })
            // On keydown event.
            .on("keyup", function(event) {
                if (!validateNode(event)) {
                    cleanChildNodes();
                }
            })
            .on("keydown cut", function(event) {
                // Prevent key events outside td element.
                if (!validateNode(event)) {
                    event.preventDefault();
                    return false;
                }

                onDelete(event);
            })
            .on('SetContent', function (event) {
                $.each($(this.targetElm).find("tr"), function(index, row) {
                    addColRemoveIcon($(row));
                });
            });

        // Add button in tinymce toolbar
        editor.addButton('stbullist', {
            tooltip: 'Add new row',
            text: '',
            icon: 'plus',
            onclick: function(e) {
                addRow();
            }
        });

    }

});