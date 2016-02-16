/*
 | Configuration Modals: custom_table
 | The code below contains custom_table default functionalinty.
 */

var ConfigModals = ConfigModals || {};

ConfigModals.custom_table = function( params ){

    var options = $.extend({
        target: null,
        targetTableSelector: ".st-custom-table",
        modalSelector: "#custom-table-editor",
        moduleData: null,
        minRows: 2,
        maxRows: 20,
        minCols: 1,
        maxCols: 4
    }, params );

    var $targetModule = null;
    var resizableCol = null;

    if( !options.target || !$(options.target).length ){
        return false;
    }else{
        $targetModule = $(options.target);
        options.moduleData = $targetModule.data("params");
    }

    var _this = this;

    var tableManager = {
        minRows: options.minRows,
        maxRows: options.maxRows,
        minCols: options.minCols,
        maxCols: options.maxCols,
        getTable: function(){
            return $( options.modalSelector ).find("table.custom-table-editor");
        },
        countCols: function(){
            return this.getTable().find("tr:eq(0) td").length;
        },
        countRows: function(){
            return this.getTable().find("tr").length;
        },
        addRow: function( quantity ){
            // How many times do append row
            var appendTimes = quantity || 1;
            // get Last row to colone
            var $newRow = this.getTable().find("tr:last-child").clone();
            // empty all td
            $.each( $newRow.find("td"), function( index, td ){
                $(td).empty();
            });
            // Append rows.
            for (var i=0; i < appendTimes; i++) {
                if( this.countRows() < this.maxRows ){
                    this.getTable().append( $newRow.clone() );
                }else{
                    return false;
                }
            };
        },
        removeRow: function( quantity ){
            // Times to do the remove function
            var removeTimes = quantity || 1;
            // Remove last <tr>
            for (var i=0; i < removeTimes; i++) {
                // Remove if not the only row.
                if( this.countRows() > this.minRows ){
                    this.getTable().find("tr:last-child").remove();
                }else{
                    return false;
                }
            };
        },
        addCol: function( quantity ){
            var appendTimes = quantity || 1;

            for (var i=0; i < appendTimes; i++) {
                if( this.countCols() < this.maxCols ){
                    $.each( this.getTable().find("tr"), function( rowIndex, row ){
                        var $newCell = $(row).find("td:last-child").clone();
                        $newCell
                            .empty()
                            .removeAttr("width");
                        $(row).append( $newCell );
                    });
                }else{
                    return false;
                }
            };
        },
        removeCol: function( quantity ){
            // Times to do the remove function
            var removeTimes = quantity || 1;
            // Remove last <td> from each <tr>
            for (var i=0; i < removeTimes; i++) {
                // Remove if not the only col.
                if( this.countCols() > 1 ){
                    this.getTable().find("tr td:last-child").remove();
                }else{
                    return false;
                }
            };
        },
        alterTable: function( action, quantity ){
            if( !action || !this[action] ){
                return false;
            }

            if( action == "addCol" || action == "removeCol" ){
                destroyColResize();
            }

            var manyTimes = quantity || 1;
            this[action]( manyTimes );

            if( action == "addCol" || action == "removeCol" ){
                initColResize();
            }
        },
        getData: function(){
            var $table = this.getTable().clone();
            var dataArr = [];

            $.each( $table.find("tr"), function( rowIndex, row ){
                var rowArr = [];

                $.each( $(row).find("td"), function( cellIndex, cell ){
                    var cellObj = {};

                    // Add width only from the first row
                    if( rowIndex == 0 && parseInt($(cell).css("width").replace("px","")) ){
                        cellObj.width = parseInt($(cell).css("width").replace("px",""));
                    }

                    // remove ui resizable
                    if( $(cell).hasClass("ui-resizable") ){
                        $(cell).resizable().resizable("destroy");
                    }

                    // Set cell content
                    cellObj.value = $(cell).html();

                    // Push cell to row
                    rowArr.push(cellObj);
                });

                // Push row to data array
                dataArr.push(rowArr);
            });
            
            return dataArr;
        },
        getTableContent: function(){
            var $table = this.getTable().clone();
            // Destroy ui resizable
            $table.find(".ui-resizable").resizable().resizable("destroy");
            // Remove contenteditable
            $table.find("[contenteditable]").removeAttr("contenteditable");

            return $table.find("tr");
        }
    };

    /*
     * Set busy
     */
    this.setBusy = function(){
        $( options.modalSelector ).find(".control-form-fields .spinner").show();
    };

    /*
     * Set ready
     */
    this.setReady = function(){
        $( options.modalSelector ).find(".control-form-fields .spinner").hide();
    };

    /*
     * Set events on field cols and rows
     */
    var setFieldsEvents = function(){
        $( options.modalSelector )
            // Deny letters input
            .on('keypress', '.table-command', function( e ){
                _this.setBusy();
                if (String.fromCharCode(e.keyCode).search(/[^a-zA-Z]+/) === -1) {
                  return false
                }
            })
            // Update table on keyup
            .on('keyup', '.table-command', function( e ){
                if( this.value > 0 ){
                    var value = parseInt(this.value);
                    var inputName = $(this).attr("name");
                    var actualItemsLength = 0;
                    var element = "";

                    if( inputName == "cols" ){
                        actualItemsLength = tableManager.countCols();
                        element = "Col";
                    }else if( inputName == "rows" ){
                        actualItemsLength = tableManager.countRows();
                        element = "Row";
                    }

                    if( actualItemsLength ){
                        var diff =  value - actualItemsLength;
                        if( diff > 0 ){
                            // Add
                            tableManager.alterTable('add'+element, diff);
                        }else if( diff < 0 ){
                            // Remove
                            tableManager.alterTable('remove'+element, Math.abs(diff));
                        }
                    }
                }
                if( String.fromCharCode(e.keyCode).match(/^\d+/) ){
                    updateControls();
                }

                _this.setReady();
            })
            .on('keyup', '.table-command[name=rows]', function( e ){
                if( this.value != '' && this.value < options.minRows || this.value > options.maxRows ){
                    updateControls();
                }
            })
            .on('keyup', '.table-command[name=cols]', function( e ){
                if( this.value != '' && this.value < options.minCols || this.value > options.maxCols ){
                    updateControls();
                }
            })
            .on('blur', '.table-command', function( e ){
                updateControls();
            })
            .on('paste', 'table.custom-table-editor td', function(e){
                e.preventDefault();
                var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
                document.execCommand('insertText', false, text);
            });
    };

    var destroyColResize = function(){
        if( resizableCol != null ){
            resizableCol.resizable("destroy");
            resizableCol = null;
        }
    };

    var initColResize = function(){
        if( resizableCol == null ){
            tableManager.getTable().find("tr:first-child td:last-child").css("width","auto");
            var elements = tableManager.getTable().find("tr:first-child td:not(:last-child)");
            resizableCol = elements.resizable({
                grid: [1, 10000],
                handles: 'se'
            });
            tableManager.getTable().find(".ui-resizable-handle").attr("contenteditable","false");
        }
    };

    var updateControls = function(){
        $( options.modalSelector ).find("input[name=rows]").val( tableManager.countRows() );
        $( options.modalSelector ).find("input[name=cols]").val( tableManager.countCols() );
    };

    /*
     * -- Init config modal --
     */
    this.init = function(){
        _this.setBusy();
        // Load Table styles
        $( options.modalSelector ).find("table.custom-table-editor").attr( "style", $targetModule.find( options.targetTableSelector ).attr("style"));
        // Load Table
        $( options.modalSelector ).find("table.custom-table-editor").append( $targetModule.find( options.targetTableSelector + " tr").clone() );
        $( options.modalSelector ).find("table.custom-table-editor").css({
            maxWidth: $targetModule.find(".st-custom-table").outerWidth()
        });
        // Set contenteditable
        $( options.modalSelector ).find("table.custom-table-editor td").attr("contenteditable","true");
        // Init Reize
        initColResize();

        // Init table controls
        updateControls();
        setFieldsEvents();

        // Set click on submit button
        $( options.modalSelector ).on("click", ".submit-config", function(){
            _this.onSubmit();
            return false;
        });

        _this.setReady();
    };

    /*
     * Submit changes
     */
    this.onSubmit = function(){
        if( !moduleManager ){
            return false;
        }

        _this.setBusy();
        var tableData = tableManager.getData();

        // Save comments in data-paramas
        moduleManager.saveInData( $targetModule, "table0", tableData );

        // // Update html table in module.
        var tableContent = tableManager.getTableContent();
        $targetModule.find( options.targetTableSelector ).empty().append( tableContent );
        // Update width attribute
        $.each( $targetModule.find( options.targetTableSelector ).find("tr:first-child td"), function(tdIndex, td){
            if( $(td).attr("width") ){
                $(td).attr("width", $(td).css("width").replace("px",""));
            }
        });
        // Remove width auto from last column
        $targetModule.find( options.targetTableSelector ).find("tr:first-child td:last-child").css("width","");


        _this.setReady();
        // Close Popup
        $.magnificPopup.close();    
    };

    return this;
};