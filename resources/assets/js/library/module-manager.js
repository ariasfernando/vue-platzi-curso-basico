/*
 *	-- MODULE MANAGER ---
 */

var moduleManager = {

	// The internal name of the module. Used to get the module by ajax.
	moduleName: null,

	// The internal name app of the module. Used to get the module by ajax.
    moduleAppName: null,

	// viewContent is filled with the html content of the module.
	viewContent: null,

	// Used to set the module events only once.
	eventsSet: false,

	// Used to set target module.
	modalTarget: false,

	// Template of the action tooltip.
	// We append this buttons into the module on mouseenter/mouseleave.
    actionsButtonsTpl:  '<div class="actions-buttons-tooltip st-remove-element">' +
    '<a href="#" class="action-sortable"><i class="glyphicon glyphicon-resize-vertical"></i></a>' +
    '<a href="#" class="action-config"><i class="glyphicon glyphicon-cog"></i></a>' +
							'<a href="#" class="action-duplicate"><i class="glyphicon glyphicon-duplicate"></i></a>'+
    '<a href="#" class="action-remove"><i class="glyphicon glyphicon-remove-sign"></i></a>' +
						'</div>',

	// The internal name of the modal. Used to get the modal by ajax.
	modalConfigName: null,

	// Set configuration modal for images modules
	modalConfig: {},

    init: function () {
		// Set modules events
		this.setModulesEvents();
		// Init modules plugins.
		this.initPlugins();
	},

	// Turn all variables to null.
    reset: function () {
		this.moduleName = null;
		this.content = null;
	},

	// Add module to email template.
	addModule: function( moduleName, moduleAppName ){
        var selectedMode = $('.switch-input:checked').val();

		if( moduleName ){

			var module = this;

            // If module name is the same as the last module added, only draw it.
             if (module.viewContent != null && $(module.viewContent).data("params") && moduleName == $(module.viewContent).data("params").type && $(module.viewContent).data("duplicated")) {
               // Draw module on canvas
                module.drawOnCanvas(function () {
					// init module plugins
					module.initPlugins();
                    Application.utils.changeBuildingMode(selectedMode);
				});

			// If not the same, reset variabels, get template view and draw it.
            } else {
				// Reset module variables.
				module.reset();

				// Set module id
				module.moduleName = moduleName;
				// Set module app name
				module.moduleAppName = moduleAppName;

				// Get view content by ajax.
				var getViewRequest = module.getModuleView();

				// Request Success
                getViewRequest.done(function (html) {
					// Set module html content
					module.viewContent = html;
					// Draw module on canvas
                    module.drawOnCanvas(function () {
						// init module plugins
						module.initPlugins();
                        Application.utils.changeBuildingMode(selectedMode);
					});
				});

				// Request Fail
                getViewRequest.fail(function () {
                    Application.utils.alert.display("Error:", "An error occurred while trying to get the module, please try again later.", "danger");
				});
			}
		}
	},
	duplicateModule: function( moduleName, moduleAppName, inheritedData ){
        var selectedMode = $('.switch-input:checked').val();

		if( moduleName ){

			var module = this;

			// Reset module variables.
			module.reset();

			// Set module id
			module.moduleName = moduleName;
			// Set module app name
			module.moduleAppName = moduleAppName;

			// Get view content by ajax.
			var getViewRequest = module.getModuleView(inheritedData);

			// Request Success
            getViewRequest.done(function (html) {
				// Set module html content
				module.viewContent = html;
				// Draw module on canvas
                module.drawOnCanvas(function () {
					// init module plugins
					module.initPlugins();
                    Application.utils.changeBuildingMode(selectedMode);
				});
			});

			// Request Fail
            getViewRequest.fail(function () {
                Application.utils.alert.display("Error:", "An error occurred while trying to get the module, please try again later.", "danger");
			});
		}
	},

 	// Make Ajax Request.
	// Return the ajax object.
    getModuleView: function (inheritedData) {
		var _this = this;

		var url = Application.globals.baseUrl + "/template/module";
		var data = {
			app_name: _this.moduleAppName,
			name: _this.moduleName,
			library_name: Application.globals.library_name,
			campaign_id: campaignManager.getCampaignId(),
		};
		//For cloning modules
		if(inheritedData) {
			data.module_data = inheritedData;
		}

		// Do request
		return request = $.ajax({
			cache: true,
			dataType: "html",
			url: url,
			data: data
		});
	},

	// Draw module in canvas template
    drawOnCanvas: function (callback) {
		var $canvas = Application.utils.getCanvas();
		var $moduleContent = $(this.viewContent);

        if ($canvas) {
            var bounds = $canvas.outerHeight();
            $canvas.append($moduleContent);

            var isVisible = bounds < window.innerHeight && bounds > 0;

            if (!isVisible) {
                $('html, body').animate({
                    scrollTop: bounds
                }, 2000);

                $moduleContent.fadeOut(200).fadeIn(200);
            }

			// Animation to highlight new module
			var timesLeft = 5;
            while (timesLeft) {
				timesLeft--;
                setTimeout(function () {
					$moduleContent.animate({
						opacity: 0.4
                    }, 250, function () {
						$(this).animate({
							opacity: 1
                        }, function () {
							// Update data
							$moduleContent.find("[contenteditable]").blur();
						});
					});
				}, 500);

			}


			// Callback
            if (callback) {
				callback();
			}
		}
	},

	// Open configuration modal
    configModal: function (params) {
        if (!params.view) {
            Application.utils.alert.display("Warning:", "An error occurred while trying to open the configuration modal, missing params.", "warning");
			return false;
		}

		var _this = this;

		$.magnificPopup.open({
			type: 'ajax',
			closeOnBgClick: false,
			items: {
				src: Application.globals.baseUrl + "/template/modal"
			},
			ajax: {
				settings: {
                    type: "POST",
					cache: true,
					dataType: "html",
					data: {
						app_name: params.appName,
						name: params.view,
						library_name: Application.globals.library_name
					}
				}
			},
			callbacks: {
                ajaxContentAdded: function () {
                    if (params.type && ConfigModals && ConfigModals[params.type]) {
						// Get config from modals.php
                        var modalConfig = _this.modalConfig[params.type] || {};
						modalConfig.target = _this.modalTarget;
						// Init configuration modal scripts
                        var configurationModalObj = ConfigModals[params.type](modalConfig);
						configurationModalObj.init();
                    } else {
                        Application.utils.alert.display("Warning:", "An error occurred while trying to init the configuration modal, missing params.", "warning");
						return false;
					}
				}
			}
		});
	},

	// Delete module from canvas.
    deleteModule: function ($deleteModule) {
		var $moduleDataParams = $deleteModule.data("params");
        if ($moduleDataParams.plugins) {
			this.destroyPlugins($deleteModule);
		}

        var notyId = $deleteModule.find('[data-noty-id]').data('noty-id') || undefined;
        if (notyId) {
            Application.utils.notifications().close(notyId);
        }

		$deleteModule.remove();
	},

/*
	 * Init tinymce editor default.
	 * If I have more than one tinyMce in the same module get $contentTiny. 
	 */
	initTinymce: function( $module, configTinymce, $contentTiny){
		if(!$module || !configTinymce.selector){
			return false
		}

        configTinymce = $.extend({
            content_selector: ".text-overlay"
        },configTinymce);

		var _this = this;

		var saveDataTimeOut = null;
		
		var moduleDataParams = $module.data("params");

		if ($contentTiny){
            var $moduleText = $contentTiny.find(configTinymce.content_selector);
		}else{
            var $moduleText = $module.find(configTinymce.content_selector);
		}
		
		// Module Text options.
        if (moduleDataParams.toolbox) {
            var $toolbox = _this.drawToolbox(moduleDataParams, $moduleText, configTinymce.content_selector);
		}	
			
		// Default config
		var defaultConfigTinymce = {
            document_base_url: Application.globals.cdnHost + "/js/tinymce/",
            skin_url: Application.globals.cdnHost + '/css/tinymce/lightgray',
			setup: function (editor) {
				var dataParams = $module.data("params");
				if( ModuleActions && dataParams.type && ModuleActions[dataParams.type] ){
					var actions = new ModuleActions[dataParams.type]();
					if( actions.onTinymceInit ){
						actions.onTinymceInit( editor );
					}
				}

                editor.on('change', function(e) {
                    var $el = $('#' + e.target.id);

                    if ( $el.has('[truncate]') ) {
                        var maxLength = $el.attr('truncate');
                        var html = editor.getContent();
                        var text = editor.getContent({format: 'text'});

                        if ( text.length > maxLength ) {
                            var truncated = Application.utils.htmlSubstr(html, maxLength);
                            editor.setContent(truncated);
                        }
                    }
                });
			}
		}
 	
		// Set editor index & class name 
		if ($contentTiny){
            var editorNumber = $(".st-edit-text").index($contentTiny.find( configTinymce.selector ));
		}else{
            var editorNumber = $(".st-edit-text").index($module.find( configTinymce.selector ));
		}

		var editorIdPreText = "text-editable-";

		// If editor id exist then find a new one.
        if (tinyMCE && tinyMCE.editors[editorIdPreText + editorNumber]) {
			var numberFound = false;
            for (var i = 0; i <= tinyMCE.editors.length; i++) {
                if (!tinyMCE.editors[editorIdPreText + i] && !numberFound) {
					editorNumber = i;
					numberFound = true;
				}
			}
		}

		var editorId = editorIdPreText + editorNumber;

		// Override tinyMCE selector
		if ($contentTiny){
			$contentTiny.find( configTinymce.selector ).attr("id", editorId );
		}else{
			$module.find( configTinymce.selector ).attr("id", editorId );
		}
		
		configTinymce.selector = "#" + editorId;

		// Override tinyMCE fixed toolbar container
        if (configTinymce.fixed_toolbar_container) {
			var toolboxId = "text-overlay-toolbox-" + editorNumber;
			
			if ($contentTiny){
				$contentTiny.find(configTinymce.fixed_toolbar_container).attr( "id", toolboxId );
			}else{
				$module.find(configTinymce.fixed_toolbar_container).attr( "id", toolboxId );
			}
			
			configTinymce.fixed_toolbar_container = "#" + toolboxId;
		}

		// Extend config
        var config = $.extend(defaultConfigTinymce, configTinymce);

		// Init Tinymce.
		tinymce.init(config);

		//If I have more than one tinyMce in the same module. Reset option configTinymce.
		if ($contentTiny){
			configTinymce.fixed_toolbar_container = '.text-overlay .text-overlay-toolbox';
			configTinymce.selector = '.st-edit-text';
		}	

		$moduleText.find('.st-edit-text')
			// Save text on last key up.
            .on("keyup", function (e) {
				var editTextElement = this;
                var index = $module.find("[contenteditable]").index(editTextElement);
				
                if (saveDataTimeOut != null)
                    clearTimeout(saveDataTimeOut);

                saveDataTimeOut = setTimeout(function () {
                    _this.saveInData($(editTextElement).parents("[data-params]"), "text" + index, $(editTextElement).html());
				}, 1000);
			})
			// Save text on blur
            .on("blur", function () {
                if (saveDataTimeOut != null)
                    clearTimeout(saveDataTimeOut);

				var editTextElement = this;

                var index = $module.find('[contenteditable]').index(editTextElement);
                _this.saveInData($(editTextElement).parents("[data-params]"), "text" + index, $(editTextElement).html());
			});
	},

	/*
	 * draw toolbox to tinymce editor default.
	 */
    drawToolbox: function (moduleDataParams, $moduleText, selector) {
		// Generate Toolbox
		var	moduleTextOptionsToolbox = moduleDataParams.toolbox;
		var $toolbox = $('<div class="toolbox"></div>');

        $.each(moduleTextOptionsToolbox, function (key, config) {
            $toolbox.append('<a href="#" class="' + config.class + '"><i class="glyphicon glyphicon-' + config.icon + '"></i></a>');
		});

        if (moduleTextOptionsToolbox.colorPicker) {
            var $toolboxWithListColor = this.openPopoverColorPicker($moduleText, moduleTextOptionsToolbox, $toolbox, moduleDataParams, selector);
		}

		return $toolboxWithListColor
	},

	/*
     * Open color picker
     * Depracated: you should use tinymce textcolor.
	 */
    openPopoverColorPicker: function ($moduleText, moduleTextOptionsToolbox, $toolbox, moduleDataParams, selector) {
		var _this = this;
		
		// create color list
        if (moduleTextOptionsToolbox.colorPicker.colors_list) {
			
			var colorsList = moduleTextOptionsToolbox.colorPicker.colors_list

            var $colorPicker = $('<div style="display:none;">' +
                '<select name="colorpicker-option-selected" style="display:none;">' +
                '</select>' +
								 '</div>');
			

            $.each(colorsList, function (color, value) {
                $colorPicker.find('select').append($("<option>").attr('value', value).text(color));
			});
			
		}

		// Append toolbox
		$moduleText.find('.text-overlay-toolbox').append($toolbox);
		$toolbox.append($colorPicker);
		
	 	// Init Simplecolorpicker
        var selectColor = (moduleDataParams.color) ? moduleDataParams.color : moduleTextOptionsToolbox.colorPicker.color_default;
		$('select[name="colorpicker-option-selected"]').simplecolorpicker();
		$('select[name="colorpicker-option-selected"]').simplecolorpicker('selectColor', selectColor);	

		
		// Build color picker button
	 	var $colorPickerIcon = $toolbox.find(".color-picker");
		
		// Set attributes for bootstrap popover and Init popover
		$colorPickerIcon
			.attr({
				"role": "button",
				"data-trigger": "manual",
				"data-placement": "bottom"
			})
			.popover({
                container: 'body',
				content: $toolbox.find('.simplecolorpicker'),
				html: true
			});


		var popoverTo = 0;

        function hidePopover() {
            popoverTo = setTimeout(function (e) {
				$colorPickerIcon.popover('hide');
				$moduleText.removeClass('hover');
            }, 1500);
		}

        function overrideHidePopover() {
			clearTimeout(popoverTo);
		}

		// Set icon click: Open popover and close popover.
		$colorPickerIcon
            .on("mouseenter", function () {
                if (!$('.popover').length) {
					$colorPickerIcon.popover("show");
					$moduleText.addClass('hover');
				}

				return false;
			})	
            .on("mouseleave", function (e) {
				hidePopover($colorPickerIcon);
			})	
            .on("click", function (e) {
				e.preventDefault();
			})
			.on('shown.bs.popover', function () {
				var idPopover = $(this).attr('aria-describedby');
                $('#' + idPopover).on("mouseenter", function () {
					overrideHidePopover();
				});
				
                $('#' + idPopover).on("mouseleave", function () {
					hidePopover();
					return false;
				});

                var $module = $moduleText.parents("[data-params]");
                selector = selector || '';
                $module.find(selector +' select[name="colorpicker-option-selected"]').on('change', function (e) {
                    var selectedColor = $(e.target).val();
					$moduleText
                        .css('color', selectedColor)
						.removeClass('hover');

					$colorPickerIcon.popover('hide');
                    var strSelector = selector.replace(".","-");
                    _this.saveInData($module, "color" + strSelector, selectedColor);
					return false;
				});
			});

		return $toolbox;
	},

	// init plugin with draw on canvas
    initPlugins: function () {
		// Get all Modules
		var $canvas = $("#emailCanvas");
		var $modules = $canvas.find("tr[data-params]");

		var _this = this;
		
		// Check if need initialize some plugin
        $.each($modules, function (index, module) {
			var $module = $(module);
			var moduleParams = $module.data("params");
			
            // Init module actions
            if( !moduleParams.initialized ){
                var dataParams = $module.data("params");
                if( dataParams.type && ModuleActions && ModuleActions[dataParams.type] ){
                    var actions = new ModuleActions[dataParams.type]();
                    if( typeof actions.init == "function" ){
                        actions.init($module);
                    }
                }
            }

            if (moduleParams.plugins && !moduleParams.initialized) {
				
                $.each(moduleParams.plugins, function (plugin, pluginConfig) {
					if( plugin == "tinymce" ){
                        // If pluginConfig is an array of multiple tinymce configs
                        if( typeof pluginConfig[0] == "object" ){
                            $.each(pluginConfig,function(index, config){
                                _this.initTinymce( $module, config );
                            });
                        // If pluginConfig is just one.
                        }else{
						//If I have more than one tinyMce in the same module  
						//generate a $contentTiny for index tinymce.
						if($module.find( pluginConfig.selector ).length > 1){
							var $selectorTinymce = $module.find( pluginConfig.selector );
							$.each( $selectorTinymce, function( index, selectorTinymce ){
								var $contentTiny = $(selectorTinymce).closest('table');
								_this.initTinymce( $module, pluginConfig, $contentTiny );
							});
						}else{
							_this.initTinymce( $module, pluginConfig );
						}
					}
                    }

				});
            }

            // Set module as initialized
				moduleParams.initialized = true;
		});
	},

    destroyPlugins: function ($module) {
		var moduleDataParams = $module.data("params");
        if (moduleDataParams.plugins.tinymce) {
            $.each($module.find(".st-edit-text"), function (index, element) {
				var editorId = $(element).attr("id");
                if (tinyMCE && tinyMCE.editors[editorId]) {
					tinyMCE.editors[editorId].destroy();
				}
			});
		}
	},

    getModuleData: function( $module, dataKey ){
        if( !$module ){
            return false;
        }

        var data = {};
        var dataParams = $module.data("params") || $module.parents("[data-params]").data("params");

        if( dataKey ){
            if( dataParams.data[dataKey] ){
                data = dataParams.data[dataKey];
            }
        }else{
            data = dataParams.data;
        }

        return data;
    },

	/*
	 *	Save in module data.
	 *	@param $module ( jQuery element )
	 *	@param key (String)
	 */
    saveInData: function ($module, key, value) {
        if (!key || !$module) {
			return false;
		}

		// Get module params
		var dataParams = $module.data("params");
		dataParams.data = dataParams.data || {};
		// Set data.
		dataParams.data[key] = value;
	},

    actionConfig: {
        show: function($row){
            /* -- Show action buttons -- */
            // Remove all action iconst remove icon that it is select
            // $row.find(".actions-buttons-tooltip").not( $row.find(".actions-buttons-tooltip") ).remove();
            $canvas.find("tr[data-params]").not($row).find(".actions-buttons-tooltip").hide()

            // Check if the action buttons are in the module.
            if( $row.find(".actions-buttons-tooltip").length ){
                // Stop fade out animation and show it again
                $.each($row.find(".actions-buttons-tooltip"),function(index,tooltip){
                    $(tooltip).stop().fadeIn("fast");
                });
            }else{
                $row.find("> td").append($(moduleManager.actionsButtonsTpl).fadeIn('slow'));
                // It they aren't in the module, append and show them.
                $.each($row.find("td.st-modal-config-icon"),function(index,container){
                    $(container).append( $(moduleManager.actionsButtonsTpl).fadeIn('slow') );
                });
            }
        },
        hide: function($row){
            $row.find(".actions-buttons-tooltip").fadeOut(2000);
        }
    },

    setModulesEvents: function () {
        if (this.eventsSet) {
			return false;
		}

		var module = this;
		var $canvas = Application.utils.getFullCanvas();

        if (!$canvas) {
			return false;
		}

		$canvas
            .on("mouseenter", "tr[data-params]", function () {
				var $row = $(this);

                // Display action config
                moduleManager.actionConfig.show($row);

				// Highlight module
                if (!$row.find("#moduleHighlight").length && $row.height() < 5) {
                    $row.find(".actions-buttons-tooltip").css("top", "-10px");
					var $hoverTable = $('<table id="moduleHighlight"><tr><td></td></tr></table>');

					$hoverTable.css({
						width: Application.globals.emailWidth,
						height: $row.height()
					});

					$row.find("> td")
						.addClass("st-position-relative")
                        .append($hoverTable);

					$row.find("#moduleHighlight").animate({
						top: "-10px",
						left: "-10px",
						borderWidth: "10px"
					}, 50);
				}
			})
            .on("mouseleave", "tr[data-params]", function () {
                var $row = $(this);

				/* -- Hide Action buttons Tooltip -- */
                moduleManager.actionConfig.hide($row);

				// Remove module highlight element
                $row.find("#moduleHighlight").remove();
                $row.find(".st-position-relative").removeClass("st-position-relative");
			})
            .on("click", ".st-without-event", function (e) {
				// Without event click
				e.preventDefault();
			})
            .on("click", '.action-remove', function () {
				var $deleteModule = $(this).closest("[data-params]"); 
                if( Application.globals.confirmDeleteModule ){
                    var confirmModal = new Application.utils.confirm({
                        // Message to display
                        message: "Are you sure? Please click OK to remove this module from your email.",
                        // Function to execute when confirm is true.
                        onSubmit: function(){
                            // Remove module
			    module.deleteModule($deleteModule);
                        }
                    });
                    confirmModal.display();
                }else{
                    module.deleteModule($deleteModule);
                }
				return false;
			})
			.on("click",'.action-duplicate', function(){
				// Duplicate module 
				var moduleToDuplicate = $.extend($(this).closest("[data-params]").data('params'), {duplicated: true});
				module.duplicateModule(moduleToDuplicate.type, moduleToDuplicate.file_parent, moduleToDuplicate.data);
				return false;
			})
            // Action Config
            .on("click", '.action-config', function(event) {
                var $moduleElement = $(this).parents("[data-params]")

                // Set config modal default or from data-params
                var modalName = $moduleElement.data("params").type  + "_config";
                var configModalKey = $moduleElement.data("params").type;
                var configItem = 0;

                if ($moduleElement.data('params').config_modal && $moduleElement.data('params').config_modal != "") {
                    modalName = $moduleElement.data('params').config_modal;
                }

                if ($moduleElement.data('params').config_modal_key && $moduleElement.data('params').config_modal_key != "") {
                    configModalKey = $moduleElement.data('params').config_modal_key;
                }

                if( $(event.target).parents(".st-modal-config-icon").length ){
                    configItem = $moduleElement.find(".st-modal-config-icon").index($(event.target).parents(".st-modal-config-icon"));

                    if( typeof $(event.target).parents(".st-modal-config-icon").data("config-modal") !== "undefined" ){
                        modalName = $(event.target).parents(".st-modal-config-icon").data("config-modal");
                    }
                    if( typeof $(event.target).parents(".st-modal-config-icon").data("config-script") !== "undefined" ){
                        configModalKey = $(event.target).parents(".st-modal-config-icon").data("config-script");
                    }
                }

                var appName = $moduleElement.data("params").app_name || $moduleElement.data("params").file_parent;

                // configModal
                var configModal = new modalManager({
                    app_name: appName,
                    view: modalName,
                    config_modal_key: configModalKey,
                    config_item: configItem
                });
                configModal.modalTarget = $moduleElement;
                configModal.open();

                return false;
            })

            // Open config element
            .on("click", "[data-open-element-config]", function () {
                // Get modal config from data attr
                var modalConfig = {};
                if ($(this).data("open-element-config") != "") {
                    modalConfig = module.modalConfig[$(this).data("open-element-config")];
                }else{
                    return false;
                }

                if( modalConfig.config_modal_key && ConfigModals && ConfigModals[modalConfig.config_modal_key] ){
                    modalConfig.target = this;
                    var configurationModalObj = ConfigModals[ modalConfig.config_modal_key ](modalConfig);
                    configurationModalObj.open();
                }

                return false;
            })
			// Call function configModal to open modal
            .on("click", "[data-master-image-editor]", function () {
				//Set target in modalTarget
				module.modalTarget = this;

				// Set modal config
				var modalConfig = {};
                if ($(this).data("master-image-editor") != "") {
                    modalConfig = module.modalConfig[$(this).data("master-image-editor")];
				}
				modalConfig.campaign_id = campaignManager.getCampaignId();

				// Init Modal
                var modalImageEditor = new masterImageEditor(modalConfig);
				// Open Modal
				modalImageEditor.openModal();
				
				return false;
			})
			// Open master button editor
            .on("click", "[data-master-button-editor]", function () {
				//Set target in modalTarget
				module.modalTarget = this;

				// Set modal config
				var modalConfig = {};
                if ($(this).data("master-button-editor") != "") {
                    modalConfig = module.modalConfig[$(this).data("master-button-editor")];
				}
				modalConfig.campaign_id = campaignManager.getCampaignId();

				// Init Modal
                var modalButtonEditor = new masterButtonEditor(modalConfig);
				// Open Modal
				modalButtonEditor.openModal();

				return false;
			})
			// Set open library click
            .on("click", "[data-image-library]", function () {
				var targetElement = this;
				// Data params
				var dataParams = $(this).parents("[data-params]").data('params');
				// get library config
				var libraryConfig = {};
                if ($(this).data("data-image-library") != "") {
					libraryConfig = $(this).data("image-library");
				}

				// Set submit
                libraryConfig.onSubmit = function (imageData) {
                    if (dataParams.type && ModuleActions && ModuleActions[dataParams.type]) {
                        var actions = new ModuleActions[dataParams.type]({target: targetElement});

                        if (actions.onLibrarySubmit) {
                            actions.onLibrarySubmit(imageData);
						}
					}
				};

				// Init Library
                var library = new imageLibrary(libraryConfig);
				// Open Modal
				library.open();

				return false;
			})
            .on("click", "[data-modal]", function () {
				var dataParams = $(this).parents("[data-params]").data('params');

				// Remove error if the element has it
				$(this).removeClass("default-image-error");

				// Set name modal of data modal
				var dataModal = $(this).attr('data-modal');
				
				//If dataModal is empty get name modal of data-param
                if (dataModal == '') {
					dataModal = dataParams.type;
				}

				//Call function configModal
                module.configModal({view: dataModal});

				//Set target in modalTarget
				module.modalTarget = this;

				return false;
			})
			// Prevent enter on content editable
            .on("keypress", ".st-content-editable-single-line[contenteditable]", function (e) {
				return e.which != 13;
			})
            .on("keyup", "[data-line-limit]", function (e) {
                Application.helpers.limitLines(e.target);
            })
            .on("focus", "[data-maxwidth]", function (e) {
                Application.helpers.limitWidth(e.target);
            })
			// Save content editable on element blur.
            .on("blur", "[contenteditable]:not(.st-edit-text)", function () {
				var $moduleElement = $(this).parents("[data-params]");

				// Convert to Uppercase
                if ($(this).css("text-transform") == 'uppercase') {
                    $(this).html(($(this).html()).toUpperCase().replace(/&NBSP;/g, "&nbsp;"));
				}

                var dataKey = "text" + $moduleElement.find("[contenteditable]").index(this);
				var dataValue = "";

                if ($(this).hasClass("st-save-only-text")) {
					dataValue = $(this).html();
                } else {
					dataValue = this.outerHTML;
				}

				// Prevent element deletion if it is empty.
                if ($(this).text() == "") {
					$(this).empty();
				}

				// Save in module data-params
                moduleManager.saveInData($moduleElement, dataKey, dataValue);
			})
            // Truncate pasted text if truncate attr is present
            .on("keydown", "[truncate]", function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
                     // Allow: Ctrl+A, Command+A
                    (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
                     // Allow: home, end, left, right, down, up
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                         // let it happen, don't do anything
                         return;
                }
                var $el = $(e.target);
                var maxLength = +$el.attr('truncate') || 120;
                var truncated = $(e.target).text().trim();
                if (truncated.length >= maxLength) {
                    e.preventDefault();
                    return;
                }
            })

            .on("keypress", "[truncate]", function (e) {
                var $el = $(e.target);
                var maxLength = +$el.attr('truncate') || 120;
                var truncated = $(e.target).text().trim();
                if (truncated.length >= maxLength) {
                    e.preventDefault();
                    return;
                }
            })
            .on("keyup", "[truncate]", function (e) {
                var $el = $(e.target);
                var maxLength = +$el.attr('truncate') || 120;
                var truncated = $(e.target).text().trim();
                if (truncated.length >= maxLength) {
                    e.preventDefault();
                    return;
                }
            })
            // Prevent multi line
            .on("keypress", "[singleline]", function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 13) {
                    e.preventDefault();
                }
            })
			// Prevents formatted html paste
            .on('paste', '[contenteditable]:not(.mce-content-body)', function (e) {
				e.preventDefault();
				var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
				document.execCommand('insertText', false, text);

				// Truncate pasted text if truncate attr is present
				var $el = $(e.target);
                if ($el.attr('truncate')) {
					var maxLength = $el.attr('truncate') || 120;
                    if ($el.text().trim().length >= maxLength) {
						$el.text($el.text().trim().substring(0, maxLength));
					}
				}
			});

		// Init sortable
		$canvas.find('> tbody').sortable({
            axis: 'y',
            delay: 100,
            handle: '.action-sortable',
			placeholder: "ui-state-highlight",
            start: function (event, ui) {
				// Set the height of the dragged element to placeholder box.
                $(".ui-state-highlight").height($(ui.item).height() + "px");
			}
		});

		// Set true to prevent set this events again.
		this.eventsSet = true;
	},

	getModuleParent: function($element){
		if( $element.data("params") ){
			return $element;
		}else{
			return $element.parents("[data-params]");
		}
	}
};
